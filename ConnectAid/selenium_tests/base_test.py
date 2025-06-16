import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
import requests
import os
import shutil
from config import TestConfig

class BaseTest:
    """Base test class providing common functionality for all test cases"""
    
    @pytest.fixture(autouse=True)
    def setup_and_teardown(self):
        """Setup and teardown for each test"""
        self.setup_driver()
        yield
        self.teardown_driver()
    
    def setup_driver(self):
        """Initialize Chrome WebDriver with appropriate options"""
        chrome_options = Options()
        
        if TestConfig.HEADLESS:
            chrome_options.add_argument("--headless")
        
        # Additional options for stability and CI/CD environments
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--disable-extensions")
        chrome_options.add_argument("--disable-web-security")
        chrome_options.add_argument("--allow-running-insecure-content")
        chrome_options.add_argument(f"--window-size={TestConfig.BROWSER_WIDTH},{TestConfig.BROWSER_HEIGHT}")
        
        # Initialize ChromeDriver with error handling
        try:
            # Try webdriver-manager first
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
        except Exception as e:
            print(f"First attempt failed: {e}")
            try:
                # Clear webdriver-manager cache and retry
                cache_dir = os.path.expanduser("~/.wdm")
                if os.path.exists(cache_dir):
                    shutil.rmtree(cache_dir)
                    print("Cleared webdriver cache")
                
                # Retry with fresh download
                service = Service(ChromeDriverManager().install())
                self.driver = webdriver.Chrome(service=service, options=chrome_options)
                print("Successfully initialized ChromeDriver after cache clear")
            except Exception as retry_error:
                print(f"Cache clear retry failed: {retry_error}")
                # Last resort: try without service (system PATH)
                try:
                    self.driver = webdriver.Chrome(options=chrome_options)
                    print("Using ChromeDriver from system PATH")
                except Exception as final_error:
                    raise Exception(f"All ChromeDriver methods failed. Please ensure Chrome and ChromeDriver are properly installed. Final error: {final_error}")
        
        # Set timeouts
        self.driver.implicitly_wait(TestConfig.IMPLICIT_WAIT)
        self.wait = WebDriverWait(self.driver, TestConfig.EXPLICIT_WAIT)
        
        # Navigate to base URL
        self.driver.get(TestConfig.BASE_URL)
        
    def teardown_driver(self):
        """Close the browser"""
        if hasattr(self, 'driver'):
            self.driver.quit()
    
    def wait_for_element(self, locator, timeout=None):
        """Wait for element to be present and visible"""
        if timeout is None:
            timeout = TestConfig.EXPLICIT_WAIT
        return WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located(locator)
        )
    
    def wait_for_clickable(self, locator, timeout=None):
        """Wait for element to be clickable"""
        if timeout is None:
            timeout = TestConfig.EXPLICIT_WAIT
        return WebDriverWait(self.driver, timeout).until(
            EC.element_to_be_clickable(locator)
        )
    
    def wait_for_url_contains(self, url_part, timeout=None):
        """Wait for URL to contain specific text"""
        if timeout is None:
            timeout = TestConfig.EXPLICIT_WAIT
        WebDriverWait(self.driver, timeout).until(
            EC.url_contains(url_part)
        )
    
    def fill_form_field(self, locator, value, clear_first=True):
        """Fill a form field with value"""
        element = self.wait_for_element(locator)
        if clear_first:
            element.clear()
        element.send_keys(value)
    
    def click_element(self, locator):
        """Click an element"""
        element = self.wait_for_clickable(locator)
        element.click()
    
    def get_element_text(self, locator):
        """Get text from an element"""
        element = self.wait_for_element(locator)
        return element.text
    
    def is_element_present(self, locator, timeout=5):
        """Check if element is present on the page"""
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located(locator)
            )
            return True
        except:
            return False
    
    def scroll_to_element(self, locator):
        """Scroll to make element visible"""
        element = self.driver.find_element(*locator)
        self.driver.execute_script("arguments[0].scrollIntoView(true);", element)
        time.sleep(1)
    
    def take_screenshot(self, filename):
        """Take a screenshot"""
        self.driver.save_screenshot(f"screenshots/{filename}")
    
    def cleanup_test_data(self):
        """Clean up test data via API calls"""
        if TestConfig.CLEANUP_TEST_DATA:
            try:
                # Add cleanup logic here if needed
                # For example, delete test users via API
                pass
            except Exception as e:
                print(f"Cleanup failed: {e}") 