from flask import Flask
from flask import render_template

app = Flask (__name__)

@app.route('/')
def index(name=None):
	return render_template('index.html', name=name)

@app.route('/demoChinese')
def demoChinese(name="Chinese"):
	return render_template('demo.html', name=name)

@app.route('/demoSpanish')
def demoSpanish(name="Spanish"):
	return render_template('demo.html', name=name)

if __name__ == '__main__':
	app.run(debug=True)