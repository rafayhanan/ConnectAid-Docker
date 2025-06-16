#!/usr/bin/env python3
"""
Test runner script for ConnectAid Selenium tests
This script provides an easy way to run all or specific test suites
"""

import sys
import os
import subprocess
import argparse
from pathlib import Path

def setup_environment():
    """Setup the test environment"""
    # Create necessary directories
    directories = ['screenshots', 'reports', 'logs']
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
    
    # Set environment variables for headless mode if not set
    if 'HEADLESS' not in os.environ:
        os.environ['HEADLESS'] = 'true'
    
    print("Test environment setup complete")

def run_tests(test_suite=None, verbose=True, html_report=True):
    """Run the test suite"""
    cmd = ['python', '-m', 'pytest']
    
    if test_suite:
        cmd.append(test_suite)
    
    if verbose:
        cmd.append('-v')
    
    if html_report:
        cmd.extend(['--html=reports/test_report.html', '--self-contained-html'])
    
    # Add other useful options
    cmd.extend([
        '--tb=short',  # Short traceback format
        '--maxfail=10',  # Stop after 10 failures
        '--capture=sys'  # Capture stdout/stderr
    ])
    
    print(f"Running command: {' '.join(cmd)}")
    
    try:
        result = subprocess.run(cmd, check=False)
        return result.returncode
    except FileNotFoundError:
        print("Error: pytest not found. Please install it using: pip install pytest")
        return 1

def main():
    parser = argparse.ArgumentParser(description='Run ConnectAid Selenium Tests')
    parser.add_argument(
        '--suite', 
        choices=['auth', 'donation', 'profile', 'integration', 'all'],
        default='all',
        help='Test suite to run (default: all)'
    )
    parser.add_argument(
        '--headless', 
        action='store_true',
        help='Run tests in headless mode'
    )
    parser.add_argument(
        '--no-html', 
        action='store_true',
        help='Skip HTML report generation'
    )
    parser.add_argument(
        '--parallel', 
        action='store_true',
        help='Run tests in parallel (requires pytest-xdist)'
    )
    
    args = parser.parse_args()
    
    # Set headless mode if requested
    if args.headless:
        os.environ['HEADLESS'] = 'true'
    
    # Setup environment
    setup_environment()
    
    # Determine which test file to run
    test_files = {
        'auth': 'test_auth.py',
        'donation': 'test_donation_appeals.py',
        'profile': 'test_profile_wallet.py',
        'integration': 'test_integration.py',
        'all': None  # Run all tests
    }
    
    test_file = test_files.get(args.suite)
    
    print(f"Running {args.suite} test suite...")
    print(f"Headless mode: {os.environ.get('HEADLESS', 'false')}")
    
    # Run tests
    exit_code = run_tests(
        test_suite=test_file,
        verbose=True,
        html_report=not args.no_html
    )
    
    if exit_code == 0:
        print("\n✅ All tests passed!")
        if not args.no_html:
            print("📊 HTML report generated: reports/test_report.html")
    else:
        print(f"\n❌ Tests failed with exit code: {exit_code}")
    
    return exit_code

if __name__ == '__main__':
    sys.exit(main()) 