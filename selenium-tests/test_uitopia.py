import unittest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import logging
import sys

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(message)s', handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

class SimpleLoadTest(unittest.TestCase):
    def setUp(self):
        logger.info("Setting up test")
        options = Options()
        options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        self.driver = webdriver.Chrome(options=options)
        
    def tearDown(self):
        if hasattr(self, 'driver'):
            self.driver.quit()
    
    def test_app_loads(self):
        """Test that the web app loads successfully"""
        # Replace with your actual Windows IP address if needed
        url = "http://10.0.0.14:3000"
        
        logger.info(f"Trying to connect to: {url}")
        self.driver.get(url)
        
        # Wait briefly for page to load
        time.sleep(2)
        
        # Take a screenshot
        self.driver.save_screenshot("app_loaded.png")
        
        # Log page info
        logger.info(f"Page title: {self.driver.title}")
        
        # Basic check that some content loaded
        body_text = self.driver.find_element(By.TAG_NAME, "body").text
        logger.info(f"Page content preview: {body_text[:200]}...")
        
        # Very basic assertion - just check that we got some content
        self.assertGreater(len(body_text), 0, "Page should have content")
        logger.info("✅ Web app loaded successfully!")

if __name__ == "__main__":
    unittest.main()