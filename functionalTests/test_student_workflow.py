import unittest

# your test cases
import urllib2
from flask import Flask
from flask_testing import LiveServerTestCase

from selenium import webdriver
from selenium.webdriver.common.keys import Keys

class MyTest(LiveServerTestCase):

	def setup(self):
		self.driver = webdriver.Firefox()

	def test_search_in_python_org(self):
		driver = self.driver
		driver.get("http://www.python.org")
		self.assertIn("Python", driver.title)
		elem = driver.find_element_by_name("q")
		elem.send_keys("pycon")
		elem.send_keys(Keys.RETURN)
		assert "No results found." not in driver.page_source

	def tearDown(self):
		self.driver.close()

	def create_app(self):
		app = Flask(__name__)
		app.config['TESTING'] = True
		return app

	def test_server_is_up_and_running(self):
		response = urllib2.urlopen(self.get_server_url())
		self.assertEqual(response.code, 200)

if __name__ == '__main__':
    unittest.main()