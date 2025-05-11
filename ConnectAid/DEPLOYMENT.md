# ConnectAid AWS EC2 Deployment

This guide explains how to deploy the ConnectAid application on an AWS EC2 instance using Docker.

## Prerequisites

- An AWS EC2 instance running Linux
- Docker and Docker Compose installed on the EC2 instance
- MongoDB Atlas account with a database set up
- Your ConnectAid codebase

## Deployment Steps

### 1. Install Docker and Docker Compose on your EC2 instance

```bash
# Update package list
sudo apt-get update

# Install required packages
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up the Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Add current user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

Log out and log back in to apply the docker group changes.

### 2. Clone your repository on the EC2 instance

```bash
git clone [your-repository-url] connectaid
cd connectaid
```

### 3. Configure the Environment Variables

Edit the `docker-compose.yml` file and update the MongoDB Atlas connection string and JWT secret:

```bash
nano docker-compose.yml
```

Update these lines with your actual MongoDB Atlas URI and a secure JWT secret:

```yaml
environment:
  - PORT=5000
  - MONGODB_URI=mongodb+srv://your_actual_mongodb_atlas_uri
  - JWT_SECRET=your_actual_secret_key
```

### 4. Build and Start the Application

```bash
docker-compose up -d
```

This will build and start your application in detached mode.

### 5. Accessing Your Application

Your application should now be accessible at:

```
http://your-ec2-public-ip
```

### Troubleshooting

- Check container logs:
  ```bash
  docker-compose logs
  ```

- Restart containers:
  ```bash
  docker-compose restart
  ```

- Stop and remove containers:
  ```bash
  docker-compose down
  ```

## Security Considerations

- Make sure to open ports 80 and 5000 in your EC2 security group.
- Consider setting up HTTPS using a tool like Certbot.
- Don't commit your actual MongoDB credentials or JWT secret to version control. 