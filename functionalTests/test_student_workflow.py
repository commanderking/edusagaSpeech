import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

from flask import Flask
from flask_testing import LiveServerTestCase

class SubscribeTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()

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


    def test_search_in_python_org(self):
        driver = self.driver
        driver.get("http://localhost:3000")
        self.assertIn("EduSaga", driver.title)
        elem = driver.find_element_by_id('signup')
        elem.send_keys("this.would.never.be.an.email.would.it.at.games@whatever.com")
        elem.send_keys(Keys.RETURN)
      	driver.implicitly_wait(3)
      	self.switch_to_new_window('EduSaga Subscription List')

        header = driver.find_element_by_class_name('masthead')

        print header

        assertIn("EduSaga Subscription List", header)


    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()