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

@app.route('/demoChinese2')
def demoChinese2(name="Chinese2"):
	return render_template("demo.html", name=name)

@app.route('/demoVocab1')
def demoVocab1(name="Vocab1"):
	return render_template("demoVocab1.html", name=name);

@app.route('/demoVocab2')
def demoVocab2(name="Vocab2"):
	return render_template("demoVocab2.html", name=name);

if __name__ == '__main__':
	app.run(debug=True)