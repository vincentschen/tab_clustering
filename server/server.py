from flask import Flask, request
import cluster
import json

app = Flask(__name__)

@app.route('/cluster/', methods=['GET', 'POST'])
def similarities():
    if request.method == 'POST':
        data = json.loads(request.data) 
        docs = data['docs']
        
        # docs = request.form.getlist('docs')
        print "docs: ", len(docs)
        print type(docs)
        # input_ = request.form['input']
        
        input_ = data['input']
        
        
        # print "input:", input_
        sims = cluster.compute_similarity(docs, input_)
        response = json.dumps(sims)
        print response
        return response
    
