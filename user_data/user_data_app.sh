#!/bin/bash

# Everything in user data runs as root by default, so no need for sudo in the script

# Install Docker
# apt-get update -y
# apt-get install -y ca-certificates curl
# install -m 0755 -d /etc/apt/keyrings
# curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
# chmod a+r /etc/apt/keyrings/docker.asc

# echo \
#   "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
#   $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
#   tee /etc/apt/sources.list.d/docker.list > /dev/null

# apt-get update -y
# apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start Docker service
# systemctl enable docker
# systemctl start docker

# Option 1: If your EC2 instance has an IAM role with SSM parameter access
# Install AWS CLI v2
# apt-get install -y unzip
# curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
# unzip awscliv2.zip
# ./aws/install


#!/bin/bash

# Log everything
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
echo "Starting user-data script at $(date)"

# Wait for AWS services to be ready
sleep 20

# Get parameters from SSM (will only work if EC2 has the right IAM role)
echo "Retrieving parameters from SSM..."
MONGODB_URI=$(aws ssm get-parameter --name "MONGODB_URI" --with-decryption --query "Parameter.Value" --output text)
NEXTAUTH_SECRET=$(aws ssm get-parameter --name "NEXTAUTH_SECRET" --with-decryption --query "Parameter.Value" --output text)
GOOGLE_ID=$(aws ssm get-parameter --name "GOOGLE_ID" --with-decryption --query "Parameter.Value" --output text)
GOOGLE_CLIENT_SECRET=$(aws ssm get-parameter --name "GOOGLE_CLIENT_SECRET" --with-decryption --query "Parameter.Value" --output text)


# Pull your Docker image (replace with your actual image)
docker pull omerbenda98/ui_topia

# Stop any existing container with the same name
docker stop ui_topia 2>/dev/null
docker rm ui_topia 2>/dev/null
# Run the container
docker run -d --name ui_topia \
  -e MONGODB_URI="$MONGODB_URI" \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_URL_INTERNAL=http://localhost:3000 \
  -e NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
  -e GOOGLE_ID="$GOOGLE_ID" \
  -e GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" \
  -p 3000:3000 \
  omerbenda98/ui_topia

