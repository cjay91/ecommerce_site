#!/bin/bash

# Exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="us-east-1"
ECR_REPOSITORY_BACKEND="ecommerce-backend"
ECR_REPOSITORY_FRONTEND="ecommerce-frontend"
ECS_CLUSTER="ecommerce-cluster"
ECS_SERVICE="ecommerce-service"
TASK_DEFINITION="ecommerce-app"

# Print status messages
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install it first."
    exit 1
fi

# Get AWS account ID
print_status "Getting AWS account ID..."
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
if [ $? -ne 0 ]; then
    print_error "Failed to get AWS account ID. Please check your AWS credentials."
    exit 1
fi
print_status "AWS Account ID: $AWS_ACCOUNT_ID"

# Login to ECR
print_status "Logging in to Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
if [ $? -ne 0 ]; then
    print_error "Failed to login to ECR."
    exit 1
fi

# Create ECR repositories if they don't exist
print_status "Creating ECR repositories if they don't exist..."
aws ecr describe-repositories --repository-names $ECR_REPOSITORY_BACKEND --region $AWS_REGION 2>/dev/null || \
    aws ecr create-repository --repository-name $ECR_REPOSITORY_BACKEND --region $AWS_REGION

aws ecr describe-repositories --repository-names $ECR_REPOSITORY_FRONTEND --region $AWS_REGION 2>/dev/null || \
    aws ecr create-repository --repository-name $ECR_REPOSITORY_FRONTEND --region $AWS_REGION

# Build and push backend image
print_status "Building and pushing backend Docker image..."
docker build -t $ECR_REPOSITORY_BACKEND ./backend
docker tag $ECR_REPOSITORY_BACKEND:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_BACKEND:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_BACKEND:latest

# Build and push frontend image
print_status "Building and pushing frontend Docker image..."
docker build -t $ECR_REPOSITORY_FRONTEND ./frontend
docker tag $ECR_REPOSITORY_FRONTEND:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_FRONTEND:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_FRONTEND:latest

# Update task definition with correct image URLs
print_status "Updating task definition..."
TASK_DEFINITION_JSON=$(cat <<EOF
{
  "family": "$TASK_DEFINITION",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::$AWS_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::$AWS_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "runtimePlatform": {
    "operatingSystemFamily": "LINUX"
  },
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_BACKEND:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "hostPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://postgres:password@db:5432/ecommerce"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/$TASK_DEFINITION",
          "awslogs-region": "$AWS_REGION",
          "awslogs-stream-prefix": "backend"
        }
      }
    },
    {
      "name": "frontend",
      "image": "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_FRONTEND:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/$TASK_DEFINITION",
          "awslogs-region": "$AWS_REGION",
          "awslogs-stream-prefix": "frontend"
        }
      }
    },
    {
      "name": "db",
      "image": "postgres:13",
      "portMappings": [
        {
          "containerPort": 5432,
          "hostPort": 5432,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "POSTGRES_DB",
          "value": "ecommerce"
        },
        {
          "name": "POSTGRES_USER",
          "value": "postgres"
        },
        {
          "name": "POSTGRES_PASSWORD",
          "value": "password"
        }
      ],
      "mountPoints": [
        {
          "containerPath": "/var/lib/postgresql/data",
          "sourceVolume": "postgres_data",
          "readOnly": false
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/$TASK_DEFINITION",
          "awslogs-region": "$AWS_REGION",
          "awslogs-stream-prefix": "db"
        }
      }
    }
  ],
  "volumes": [
    {
      "name": "postgres_data",
      "efsVolumeConfiguration": {
        "fileSystemId": "fs-XXXXXXXXX",
        "transitEncryption": "ENABLED"
      }
    }
  ]
}
EOF
)

# Save updated task definition
echo "$TASK_DEFINITION_JSON" > aws/task-definition-updated.json

# Register task definition
print_status "Registering task definition..."
aws ecs register-task-definition --cli-input-json file://aws/task-definition-updated.json --region $AWS_REGION

# Create ECS cluster if it doesn't exist
print_status "Creating ECS cluster if it doesn't exist..."
aws ecs describe-clusters --clusters $ECS_CLUSTER --region $AWS_REGION 2>/dev/null || \
    aws ecs create-cluster --cluster-name $ECS_CLUSTER --region $AWS_REGION

# Deploy service
print_status "Deploying service..."
aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --task-definition $TASK_DEFINITION --region $AWS_REGION 2>/dev/null || \
    aws ecs create-service --cluster $ECS_CLUSTER --service-name $ECS_SERVICE --task-definition $TASK_DEFINITION --desired-count 1 --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[subnet-XXXXXXXXX],securityGroups=[sg-XXXXXXXXX],assignPublicIp=ENABLED}" --region $AWS_REGION

print_status "Deployment completed successfully!"
print_status "Your application should be accessible shortly."
