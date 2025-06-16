import os
from dotenv import load_dotenv

load_dotenv()

class TestConfig:
    # Application URLs
    BASE_URL = os.getenv('BASE_URL', 'http://localhost:82')  # Docker frontend port
    API_BASE_URL = os.getenv('API_BASE_URL', 'http://localhost:5002')  # Docker backend port
    
    # Test timeouts
    IMPLICIT_WAIT = 10
    EXPLICIT_WAIT = 20
    
    # Browser settings
    HEADLESS = os.getenv('HEADLESS', 'true').lower() == 'true'
    BROWSER_WIDTH = 1920
    BROWSER_HEIGHT = 1080
    
    # Test data
    TEST_USER = {
        'firstName': 'Test',
        'lastName': 'User',
        'email': 'testuser@connectaid.com',
        'password': 'TestPass123!',
        'phoneNumber': '+1234567890',
        'cnic': '12345-6789012-3',
        'address': '123 Test Street, Test City'
    }
    
    TEST_USER_2 = {
        'firstName': 'John',
        'lastName': 'Doe',
        'email': 'johndoe@connectaid.com',
        'password': 'JohnPass123!',
        'phoneNumber': '+0987654321',
        'cnic': '54321-0987654-3',
        'address': '456 Main Street, Another City'
    }
    
    TEST_DONATION_APPEAL = {
        'title': 'Help Build a School for Underprivileged Children',
        'description': 'We are raising funds to build a school in a remote village where children have limited access to education.',
        'targetAmount': 50000,
        'category': 'Education'
    }
    
    # Database cleanup (for integration tests)
    CLEANUP_TEST_DATA = True 