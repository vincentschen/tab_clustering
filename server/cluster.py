import re
import nltk
import string
import os

from bs4 import BeautifulSoup

from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.stem.porter import PorterStemmer
from sklearn.metrics.pairwise import cosine_similarity

def visible(element):
        if element.parent.name in ['style', 'script', '[document]', 'head', 'title']:
            return False
        elif re.match("<!--.*-->", str(element)):
            return False
        return True

def clean_document(content):
    b = BeautifulSoup(content, 'html.parser')
    texts = b.findAll(text=True)
    return " ".join(filter(visible, texts))

def compute_similarity(documents, input_):
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform([input_] + documents)
    return cosine_similarity(tfidf_matrix[0:1], tfidf_matrix)[0].tolist()[1:]
