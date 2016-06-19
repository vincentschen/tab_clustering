from flask import Flask, request
import cluster
import json

app = Flask(__name__)

@app.route('/')
def similarities(methods=['GET', 'POST']):
    if request.method == 'POST':
        docs = request.form['docs']
        input_ = request.form['input']
        return json.dumps(cluster.compute_similarity(docs, input_))
    
    
