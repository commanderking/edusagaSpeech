import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

from flask import Flask
from flask_testing import LiveServerTestCase

class SubscribeTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.PhantomJS()

	def switch_to_new_window(self, text_in_title):
		retries = 60
		while retries > 0:
			for handle in self.driver.window_handles:
				self.driver.switch_to_window(handle)
				if text_in_title in self.driver.title:
					return
			retries -= 1
			time.sleep(0.5)
		self.fail('could not find window')
    '''
    def test_demo_pages_propery_load(self):
        driver = self.driver
        driver.get("http://localhost:3000/public/home")
        driver.implicitly_wait(5)
        header_text = driver.find_element_by_tag_name("h2").text
        print header_text
        self.assertIn("Episodes Available", header_text)

        # Check one teacher page
        driver.get("http://localhost:3000/lewlaoshi/demo")
        driver.switch_to.alert()
        alert.accept()

        driver.implicitly_wait(3)

        scenario_text = driver.find_element_by_class_name("scenarioText")
        self.assertIn("Welcome back from your trip to Toronto! Your friend David has picked you up at the airport and wants to hear all about what you did!", scenario_text)
    '''
    def test_in_python_org(self):
        driver = self.driver
        driver.get("http://localhost:3000")
        self.assertIn("EduSaga", driver.title)
        elem = driver.find_element_by_id('signup')
        elem.send_keys("this.would.never.be.an.email.would.it.at.games@whatever.com")
        elem.send_keys(Keys.RETURN)
      	driver.implicitly_wait(3)
        driver.switch_to_window(driver.window_handles[-1])
        header = driver.find_element_by_class_name('masthead')

        print(header)
        self.assertIn("EduSaga Subscription List", header)

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()