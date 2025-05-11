# Setting Up Jenkins on AWS EC2 for ConnectAid CI/CD

This guide explains how to set up Jenkins on an AWS EC2 instance and configure it to build your ConnectAid application using Docker.

## 1. Create an EC2 Instance for Jenkins

1. **Launch a new EC2 instance**:
   - Amazon Linux 2 or Ubuntu 20.04 (t2.medium or larger recommended for Jenkins)
   - At least 30GB of storage
   - Configure security group:
     - Allow SSH (port 22) from your IP
     - Allow HTTP (port 80) from anywhere
     - Allow custom TCP (port 8080) from anywhere (for Jenkins UI)
     - Allow custom TCP (ports 5001 and 81) from anywhere (for the application)

2. **Connect to your EC2 instance**:
   ```
   ssh -i your-key.pem ec2-user@your-jenkins-ec2-ip
   ```
   (Use `ubuntu` instead of `ec2-user` if using Ubuntu)

## 2. Install Jenkins

### For Ubuntu:
```bash
# Update and install dependencies
sudo apt update
sudo apt install -y openjdk-11-jdk

# Add Jenkins repository
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'

# Install Jenkins
sudo apt update
sudo apt install -y jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

### For Amazon Linux 2:
```bash
# Update and install dependencies
sudo yum update -y
sudo amazon-linux-extras install java-openjdk11 -y

# Add Jenkins repository
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key

# Install Jenkins
sudo yum install jenkins -y

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

## 3. Install Docker and Docker Compose

### For Ubuntu:
```bash
# Install Docker
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install -y docker-ce

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add Jenkins user to docker group
sudo usermod -aG docker jenkins
```

### For Amazon Linux 2:
```bash
# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add Jenkins user to docker group
sudo usermod -aG docker jenkins
```

## 4. Restart Jenkins to Apply Docker Group Changes

```bash
sudo systemctl restart jenkins
```

## 5. Set Up Jenkins Initial Configuration

1. Get the initial admin password:
   ```bash
   sudo cat /var/lib/jenkins/secrets/initialAdminPassword
   ```

2. Access Jenkins in a browser:
   ```
   http://your-jenkins-ec2-ip:8080
   ```

3. Enter the initial admin password
4. Choose "Install suggested plugins"
5. Create an admin user
6. Configure the Jenkins URL

## 6. Install Required Jenkins Plugins

Navigate to "Manage Jenkins" > "Manage Plugins" > "Available" and install:

1. Docker Pipeline
2. Git Integration
3. Pipeline
4. Credentials Binding Plugin
5. Blue Ocean (optional but recommended for a better UI)

Click "Install without restart" and wait for completion.

## 7. Add Credentials to Jenkins

The pipeline will need your MongoDB Atlas URI and JWT secret:

1. In Jenkins, go to "Manage Jenkins" > "Manage Credentials"
2. Click on the "Jenkins" domain under "(global)"
3. Click "Add Credentials" in the left menu
4. Add your MongoDB Atlas URI:
   - Kind: Secret text
   - Scope: Global
   - Secret: Your MongoDB Atlas connection string
   - ID: mongodb-atlas-uri
   - Description: MongoDB Atlas URI
5. Click "Create"
6. Repeat for JWT secret:
   - Kind: Secret text
   - Scope: Global
   - Secret: Your JWT secret key
   - ID: jwt-secret
   - Description: JWT Secret Key

## 8. Create a Jenkins Pipeline Job

1. Click "New Item"
2. Enter a name (e.g., "ConnectAid-Pipeline")
3. Select "Pipeline"
4. Click "OK"
5. In the configuration page:
   - Under "Pipeline", select "Pipeline script from SCM"
   - For SCM, select "Git"
   - Enter your GitHub repository URL
   - Specify the branch (e.g., "main")
   - Set "Script Path" to "ConnectAid/Jenkinsfile"
   - Click "Save"

## 9. Configure GitHub Webhook (Optional)

To automatically trigger builds when code is pushed to GitHub:

1. In Jenkins, go to the project and copy the webhook URL
2. In GitHub, go to your repository > Settings > Webhooks > Add webhook
3. Paste the Jenkins webhook URL
4. Set content type to "application/json"
5. Select "Just the push event"
6. Click "Add webhook"

## 10. Run the Pipeline

1. Go to your pipeline job
2. Click "Build Now"
3. Monitor the build process
4. Check build logs for any issues

## 11. Accessing Your Application

Once the pipeline completes successfully, your application will be accessible at:

- Frontend: `http://your-jenkins-ec2-ip:81`
- Backend API: `http://your-jenkins-ec2-ip:5001/api`

## 12. Troubleshooting

If you encounter permissions issues:

```bash
# Check Jenkins logs
sudo tail -f /var/log/jenkins/jenkins.log

# Ensure Jenkins has Docker permissions
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

# Check Docker status
sudo systemctl status docker

# Verify Docker can run as Jenkins
sudo -u jenkins docker ps
```

## 13. Pipeline Customization

You can customize the Jenkinsfile to add more stages, such as:

- Running tests
- Performing code quality checks
- Deploying to production
- Sending notifications

Refer to the Jenkins Pipeline syntax documentation for more options. 