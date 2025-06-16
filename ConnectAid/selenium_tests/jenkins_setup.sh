#!/bin/bash

# Jenkins Test Environment Setup Script
# This script sets up everything needed to run Selenium tests in Jenkins

set -e  # Exit on any error

echo "🚀 Setting up Jenkins Test Environment..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 1. Update system packages
echo "📦 Updating system packages..."
sudo apt-get update -qq || true

# 2. Install Python3, pip, and unzip
echo "🐍 Installing Python3, pip, and system tools..."
sudo apt-get install -y python3 python3-pip python3-venv unzip || true

# 3. Install Google Chrome
echo "🌐 Installing Google Chrome..."
if ! command_exists google-chrome; then
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add - || true
    sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' || true
    sudo apt-get update -qq || true
    sudo apt-get install -y google-chrome-stable || true
    echo "✅ Google Chrome installed"
else
    echo "✅ Google Chrome already installed"
fi

# 4. Install ChromeDriver
echo "🚗 Installing ChromeDriver..."
if ! command_exists chromedriver; then
    # Get Chrome version
    CHROME_VERSION=$(google-chrome --version | cut -d ' ' -f3 | cut -d '.' -f1-3)
    echo "Chrome version: $CHROME_VERSION"
    
    # Download and install ChromeDriver
    CHROMEDRIVER_VERSION=$(curl -s "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_$CHROME_VERSION")
    wget -q -O /tmp/chromedriver.zip "https://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip" || true
    
    if [ -f /tmp/chromedriver.zip ]; then
        sudo unzip -o /tmp/chromedriver.zip -d /usr/local/bin/ || true
        sudo chmod +x /usr/local/bin/chromedriver || true
        rm -f /tmp/chromedriver.zip
        echo "✅ ChromeDriver installed"
    else
        echo "⚠️  ChromeDriver download failed, will use webdriver-manager"
    fi
else
    echo "✅ ChromeDriver already installed"
fi

# 5. Install Xvfb for headless display
echo "📺 Installing Xvfb for headless display..."
sudo apt-get install -y xvfb || true

# 6. Install Python dependencies
echo "📋 Installing Python test dependencies..."
pip3 install --user -r requirements.txt --break-system-packages || {
    echo "Installing individual packages with system override..."
    pip3 install --user selenium pytest pytest-html webdriver-manager --break-system-packages || true
}

# 7. Set up virtual display
echo "🖥️  Starting virtual display..."
export DISPLAY=:99
sudo pkill Xvfb || true  # Kill any existing Xvfb
sudo Xvfb :99 -screen 0 1280x1024x24 > /dev/null 2>&1 &
sleep 2

# 8. Verify installations
echo "🔍 Verifying installations..."
python3 --version
google-chrome --version
chromedriver --version || echo "ChromeDriver will be handled by webdriver-manager"

# 9. Wait for applications to be ready
echo "⏰ Waiting for applications to start..."
for i in {1..10}; do
    if curl -s http://localhost:82 > /dev/null 2>&1; then
        echo "✅ Frontend is ready on port 82"
        break
    fi
    echo "Waiting for frontend... ($i/10)"
    sleep 3
done

for i in {1..10}; do
    if curl -s http://localhost:5002 > /dev/null 2>&1; then
        echo "✅ Backend is ready on port 5002"
        break
    fi
    echo "Waiting for backend... ($i/10)"
    sleep 3
done

echo "🎉 Jenkins test environment setup complete!"
echo "Ready to run: python3 -m pytest test_connectaid_suite.py --html=test_report.html --self-contained-html -v"  