from flask import Flask, request
import cluster
import json

app = Flask(__name__)

@app.route('/cluster/', methods=['GET', 'POST'])
def similarities():
    if request.method == 'POST':
        docs = request.form.getlist('docs')
        input_ = request.form['input']
        sims = cluster.compute_similarity(docs, input_)
        response = json.dumps(sims)
        print response
        return response
    
