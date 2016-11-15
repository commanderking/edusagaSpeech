import unittest
from selenium import webdriver
from main import app, db
from flask import request
import flask
from flask_testing import TestCase


class TestHomePage(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.PhantomJS()
        self.driver.set_window_size(1120, 550)
        self.tester = app.test_client(self)

    def test_index(self):
    	tester = self.tester
    	response = tester.get('/', content_type="html/text")
    	self.assertEqual(response.status_code, 200)

    def test_public_episodes(self):
        tester = app.test_client(self)
        with app.test_request_context('/lewlaoshi/home?studentID=A9'):
            assert request.path == '/lewlaoshi/home'
            assert request.args['studentID'] == 'A9'

        #self.assert_template_used("mainMenu.html")

    def test_redirect_teacher_page_to_login_if_not_soft_logged_in(self):
        tester = app.test_client(self)
        response = tester.get('/lewlaoshi/home', content_type="html/text")
        self.assertEqual(response.status_code, 301)


    def test_see_more_episodes(self):
		driver = self.driver
		self.driver.get("http://localhost:3000")

		inner = driver.find_element_by_class_name("moreEpisodes")

		driver.find_element_by_link_text("See More Episodes").click()

		driver.switch_to_window(driver.window_handles[-1])
		driver.implicitly_wait(3)
		html_source = driver.page_source
		driver.find_element_by_id("app")
		#print(html_source)
		#driver.find_element_by_class_name("menuTitle")
		#self.assertIn("Episodes Available", header_text)

		'''
        self.driver.find_element_by_id(
            'search_form_input_homepage').send_keys("realpython")
        self.driver.find_element_by_id("search_button_homepage").click()
        self.assertIn(
            "https://duckduckgo.com/?q=realpython", self.driver.current_url
        )
		'''

    def tearDown(self):
        self.driver.quit()

if __name__ == '__main__':
    unittest.main()