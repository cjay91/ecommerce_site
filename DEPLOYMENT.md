# Deployment Guide: Hosting Frontend and Backend on AWS with Docker

This guide provides step-by-step instructions for deploying your e-commerce application (frontend and backend) on AWS using Docker containers.

## Prerequisites

Before you begin, ensure you have the following:

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured
3. Docker installed on your local machine
4. Basic understanding of AWS services (ECS, ECR, IAM)

## Architecture Overview

The deployment uses the following AWS services:
- **Amazon ECR**: To store Docker images
- **Amazon ECS**: To run containers
- **AWS Fargate**: Serverless compute for ECS
- **Amazon EFS**: For persistent database storage
- **Amazon VPC**: For network isolation

## Step-by-Step Deployment Process

### 1. Prepare Your Local Environment

1. Clone your repository:
   ```bash
   git clone https://github.com/cjay91/ecommerce_site.git
   cd ecommerce_site
   ```

2. Ensure Docker is running:
   ```bash
   docker --version
   ```

3. Configure AWS CLI with your credentials:
   ```bash
   aws configure
   ```

### 2. Set Up AWS Infrastructure

#### Create Required IAM Roles

Before running the deployment script, you need to create the necessary IAM roles:

1. Create an ECS task execution role with the following policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ecr:GetAuthorizationToken",
           "ecr:BatchCheckLayerAvailability",
           "ecr:GetDownloadUrlForLayer",
           "ecr:BatchGetImage",
           "logs:CreateLogGroup",
           "logs:CreateLogStream",
           "logs:PutLogEvents"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

2. Name the role `ecsTaskExecutionRole`.

#### Set Up Networking (VPC, Subnets, Security Groups)

1. Create or identify a VPC with at least two public subnets
2. Create a security group with the following inbound rules:
   - Port 80 (HTTP) from anywhere (0.0.0.0/0)
   - Port 5432 (PostgreSQL) from within the security group
3. Note the subnet IDs and security group ID for use in the deployment script

#### Set Up Amazon EFS for Database Persistence

1. Create an EFS file system in the same VPC
2. Create mount targets in each availability zone where your subnets exist
3. Note the EFS file system ID for use in the task definition

### 3. Update Configuration Files

Before running the deployment script, update the following placeholders in the configuration:

1. In `aws/task-definition.json`:
   - Replace `YOUR_ACCOUNT_ID` with your actual AWS account ID
   - Replace `fs-XXXXXXXXX` with your EFS file system ID
   - Update subnet IDs and security group IDs in the deployment script

2. In `deploy.sh`:
   - Update `AWS_REGION` if you want to deploy to a different region
   - Update subnet IDs and security group IDs in the network configuration section

### 4. Run the Deployment Script

Execute the deployment script:
```bash
./deploy.sh
```

The script will:
1. Build Docker images for frontend and backend
2. Push images to Amazon ECR
3. Register the task definition with updated image URLs
4. Create ECS cluster and service
5. Deploy your application

### 5. Monitor Deployment

1. Check the status of your ECS service:
   ```bash
   aws ecs describe-services --cluster ecommerce-cluster --services ecommerce-service --region us-east-1
   ```

2. View container logs in CloudWatch:
   - Navigate to CloudWatch Logs in the AWS Console
   - Look for log groups prefixed with `/ecs/ecommerce-app`

### 6. Access Your Application

After deployment is complete, your application will be accessible via the public IP address assigned to the ECS service. You can find this in the AWS Console:

1. Go to ECS in the AWS Console
2. Select your cluster (`ecommerce-cluster`)
3. Select your service (`ecommerce-service`)
4. Check the "Tasks" tab for running tasks
5. The public IP will be associated with the ENI (Elastic Network Interface) of your task

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure your AWS user has the necessary permissions for ECS, ECR, and IAM operations.

2. **Image Pull Failures**: Verify that the ECS task execution role is correctly configured and attached.

3. **Database Connection Issues**: Check that the security group allows traffic on port 5432 within the group.

4. **Application Not Accessible**: Verify that the security group allows inbound traffic on port 80 and that the subnets are public.

### Useful AWS CLI Commands

1. Check running tasks:
   ```bash
   aws ecs list-tasks --cluster ecommerce-cluster --region us-east-1
   ```

2. Stop a task (if needed):
   ```bash
   aws ecs stop-task --cluster ecommerce-cluster --task <task-id> --region us-east-1
   ```

3. View container logs:
   ```bash
   aws logs get-log-events --log-group-name /ecs/ecommerce-app --log-stream-name <stream-name> --region us-east-1
   ```

## Cleaning Up

To avoid ongoing charges, delete the resources when you no longer need them:

1. Delete the ECS service:
   ```bash
   aws ecs delete-service --cluster ecommerce-cluster --service ecommerce-service --region us-east-1
   ```

2. Delete the ECS cluster:
   ```bash
   aws ecs delete-cluster --cluster ecommerce-cluster --region us-east-1
   ```

3. Delete ECR repositories:
   ```bash
   aws ecr delete-repository --repository-name ecommerce-backend --force --region us-east-1
   aws ecr delete-repository --repository-name ecommerce-frontend --force --region us-east-1
   ```

4. Delete the EFS file system through the AWS Console (ensure no mount targets are active)

5. Delete the IAM role `ecsTaskExecutionRole` if no longer needed

## Local Development and Testing

You can test the Docker setup locally before deploying to AWS:

1. Build and run containers:
   ```bash
   docker-compose up --build
   ```

2. Access the application at `http://localhost`

3. Access the API directly at `http://localhost:8000`

## Security Considerations

1. **Database Credentials**: The current setup uses hardcoded credentials. For production, consider using AWS Secrets Manager.

2. **HTTPS**: The current setup uses HTTP. For production, consider using an Application Load Balancer with SSL termination.

3. **Network Security**: Review and restrict security group rules to only what is necessary.

4. **Container Images**: Regularly update base images and scan for vulnerabilities.

## Scaling Considerations

1. **Horizontal Scaling**: Increase the desired count of tasks in the ECS service to handle more traffic.

2. **Vertical Scaling**: Adjust CPU and memory allocations in the task definition.

3. **Database**: For production workloads, consider using Amazon RDS instead of running PostgreSQL in a container.

4. **Load Balancing**: For production deployments, use an Application Load Balancer in front of your ECS service.
