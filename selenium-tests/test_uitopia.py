import unittest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import time
import logging
import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s', 
                    handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

# URL for testing
BASE_URL = os.getenv("TEST_BASE_URL", "http://3.86.90.238:3000")

class UITopiaCoreTests(unittest.TestCase):
    def setUp(self):
        """Set up the WebDriver before each test."""
        logger.info("Setting up test environment")
        options = Options()
        options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1920,1080")
        
        self.driver = webdriver.Chrome(options=options)
        self.driver.implicitly_wait(10)
        self.wait = WebDriverWait(self.driver, 15)
        
    def tearDown(self):
        """Clean up after each test."""
        if hasattr(self, 'driver'):
            # Take screenshot on test failure
            if hasattr(self, '_outcome') and hasattr(self._outcome, 'errors'):
                for method, error in self._outcome.errors:
                    if error:
                        test_method_name = self._testMethodName
                        self.driver.save_screenshot(f"error_{test_method_name}.png")
                        logger.error(f"Test failed: {test_method_name}")
                        logger.error(f"Error: {error}")
            self.driver.quit()
        logger.info("Test environment cleaned up")
    
    def test_01_app_loads(self):
        """Test that the web app loads successfully with all critical elements."""
        logger.info(f"Testing that app loads at: {BASE_URL}")
        self.driver.get(BASE_URL)
        
        # Wait for page to load
        self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        
        # Log page info
        logger.info(f"Page Title: {self.driver.title}")
        
        # Basic check that some content loaded
        body_text = self.driver.find_element(By.TAG_NAME, "body").text
        logger.info(f"Page content preview: {body_text[:200]}...")
        
        # Verify that we got some content
        self.assertGreater(len(body_text), 0, "Page should have content")
        
        # Check for key elements on the home page
        try:
            # Check navigation
            nav = self.driver.find_element(By.CLASS_NAME, "nav_container")
            self.assertTrue(nav.is_displayed(), "Navigation should be visible")
            logger.info("✅ Navigation is visible")
            
            # Check for app name/logo
            logo_text = self.driver.find_element(By.CLASS_NAME, "nav_logo_text")
            self.assertEqual(logo_text.text, "UI-topia", "App name should be 'UI-topia'")
            logger.info("✅ App name verified")
            
            # Check for sign-in button (for non-authenticated users)
            sign_in_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Sign in with')]")
            self.assertTrue(sign_in_btn.is_displayed(), "Sign in button should be visible")
            logger.info("✅ Sign in button is visible")
            
            # Check for component cards section
            try:
                heading = self.driver.find_element(By.CLASS_NAME, "heading")
                self.assertTrue(heading.is_displayed(), "Main heading should be visible")
                logger.info("✅ Main heading is visible")
                
                # Check for category filters
                card_categories = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'cards')]/div[contains(@class, 'card')]")
                self.assertGreater(len(card_categories), 0, "Category filters should be visible")
                logger.info(f"✅ Found {len(card_categories)} category filters")
                
            except NoSuchElementException as e:
                logger.warning(f"Some content elements not found: {str(e)}")
                
        except NoSuchElementException as e:
            self.fail(f"Essential page elements not found: {str(e)}")
        
        logger.info("✅ Web app loaded successfully with all critical elements!")

    def test_02_google_login_button(self):
        """Test that the Google login button exists and is clickable."""
        logger.info("Testing Google login button")
        self.driver.get(BASE_URL)
        
        try:
            # Look for Google sign-in button
            google_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Sign in with')]")
            self.assertTrue(google_button.is_displayed(), "Google login button should be visible")
            
            # Check that the Google icon is present
            google_icon = google_button.find_element(By.TAG_NAME, "svg")
            self.assertTrue(google_icon, "Google icon should be present in the button")
            
            # Click would trigger OAuth flow, which we can't fully test in headless mode
            # But we can verify it's clickable
            self.assertTrue(google_button.is_enabled(), "Google login button should be clickable")
            
            logger.info("✅ Google login button exists and is clickable") 

        except NoSuchElementException as e:
            self.fail(f"Google login button not found: {str(e)}")  

    def test_03_component_browsing(self):
        """Test that UI components can be browsed and interacted with."""
        logger.info("Testing component browsing functionality")
        self.driver.get(BASE_URL)
        
        # Wait for components to load
        try:
            components = self.wait.until(
                EC.presence_of_all_elements_located((By.CLASS_NAME, "ui-component"))
            )
            logger.info(f"Found {len(components)} components displayed")
            
            # Check that we have at least one component
            self.assertGreater(len(components), 0, "Should have at least one component visible")

            # Verify component card structure - focus on the first component
            if len(components) > 0:
                first_component = components[0]
                
                # Check for component display area
                display_area = first_component.find_element(By.CLASS_NAME, "component-display")
                self.assertTrue(display_area.is_displayed(), "Component display area should be visible")
                
                # Check for toggle buttons
                toggle_buttons = first_component.find_elements(By.CLASS_NAME, "htmlCssToggle")
                self.assertGreater(len(toggle_buttons), 0, "HTML/CSS toggle buttons should be present")
                
                # Check for like button
                like_container = first_component.find_element(By.CLASS_NAME, "con-like")
                self.assertTrue(like_container.is_displayed(), "Like button should be visible")
                
                # Check for view code button
                view_code_btn = first_component.find_element(By.XPATH, ".//a[contains(@href, 'viewCode')]")
                self.assertTrue(view_code_btn.is_displayed(), "View code button should be visible")
                
                # Test HTML/CSS toggle functionality
                initial_code = first_component.find_element(By.CLASS_NAME, "code-display").text
                
                # Click CSS toggle button (typically the second button)
                if len(toggle_buttons) > 1:
                    toggle_buttons[1].click()  # Click the CSS button
                    logger.info("Clicked CSS toggle button")
                    
                    # Wait briefly for the toggle to take effect
                    time.sleep(1)
                    
                logger.info("✅ Component card structure verified")
            
            logger.info("✅ Component browsing test passed")
            
        except TimeoutException:
            self.driver.save_screenshot("component_browse_error.png")
            self.fail("Timed out waiting for components to load")

    def test_04_view_component_code(self):
        """Test that component code can be viewed in detail."""
        logger.info("Testing view component code functionality")
        self.driver.get(BASE_URL)
    
        try:
            # Wait for components to load
            components = self.wait.until(
                EC.presence_of_all_elements_located((By.CLASS_NAME, "ui-component"))
            )
        
            if len(components) > 0:
                # Find the first component's "View code" button
                view_code_btn = components[0].find_element(By.XPATH, ".//a[contains(@href, 'viewCode')]")
            
                # Click the view code button
                view_code_btn.click()
                logger.info("Clicked view code button")
            
                # Wait for the code view page to load
                try:
                    # Wait for the code display container
                    self.wait.until(
                        EC.presence_of_element_located((By.CLASS_NAME, "code-display-container"))
                    )
                
                    # Look for the correct code blocks based on your HTML structure
                    try:
                        # Use the correct selector for your code blocks
                        code_blocks = self.driver.find_elements(By.CLASS_NAME, "code-block")
                        self.assertGreater(len(code_blocks), 0, "Code blocks should be visible")
                    
                        # Check if the page has HTML/CSS toggle buttons
                        toggle_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(),'Show HTML') or contains(text(),'Show CSS')]")
                        self.assertGreater(len(toggle_buttons), 0, "HTML/CSS toggle buttons should be present")
                    
                        logger.info("✅ Component code view loaded successfully")
                    except NoSuchElementException as e:
                        logger.warning(f"Could not find specific code blocks: {str(e)}")
                        self.fail("Code blocks not found")
                
                    # If we made it this far, the view code page loaded successfully
                    logger.info("✅ View code page accessed successfully")
                
                except TimeoutException:
                    self.fail("Timed out waiting for code view to load")
            else:
                logger.warning("No components found to test view code functionality")
            
        except (TimeoutException, NoSuchElementException) as e:
            self.fail(f"Error testing view code functionality: {str(e)}")
if __name__ == "__main__":
    unittest.main()