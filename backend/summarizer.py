#import for model
from transformers import pipeline
from math import ceil
#import for scrapping
import requests
from bs4 import BeautifulSoup as bs
from urllib.request import urlopen as uReq
import logging

#for summarizing
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def get_link(get_l):
    link_g = get_l


def summary(html):
    #for scraping the text data
    urlRequest3 = uReq(html)
    link_page3 = urlRequest3.read()
    link_html3 = bs(link_page3, 'html.parser')
    term_policy = link_html3.text
    mystr = term_policy.split(sep='\n')
    print(mystr)

    #model
    import requests

    API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
    headers = {"Authorization": "Bearer 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"}

    def query(payload):
        response = requests.post(API_URL, headers=headers, json=payload)
        return response.json()
        
    output = query({
        "inputs": {
            "source_sentence": term_policy,
            "sentences": [
                "Opt out",
                "disagree with our term and condition"
            ]
        },
    })
    if output[0] > output[1]:
        dark =  str(output[0]*100)[:4]
    else:
        dark =  str(output[1]*100)[:4]

    #start for the summarizing part
    ite = ceil(len(mystr)/10)
    out = str("Dark pattern Detected: "+str(dark)+" %")
    summary=[""]
    summary.append(str(out))
    
    a1 = ""
    sen = ""
    i=0
    for i in range(ite//3):
        j=0
        while(i<len(mystr)):
            if j == 10:
                break
            j = j+1
            sen = sen+mystr[i]
            i = i+1
        a = summarizer(sen, max_length=50, min_length=10, do_sample=True)
        sen = ""
        print(a)
        summary.append(a[0]['summary_text'])
    return summary

def get_accuracy(url):
    #for scraping the text data
    urlRequest3 = uReq(url)
    link_page3 = urlRequest3.read()
    link_html3 = bs(link_page3, 'html.parser')
    term_policy = link_html3.text

    #model
    import requests

    API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
    headers = {"Authorization": "Bearer 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"}

    def query(payload):
        response = requests.post(API_URL, headers=headers, json=payload)
        return response.json()
        
    output = query({
        "inputs": {
            "source_sentence": term_policy,
            "sentences": [
                "Opt out",
                "disagree with our term and condition"
            ]
        },
    })
    if output[0] > output[1]:
        return output[0]
    else:
        return output[1]