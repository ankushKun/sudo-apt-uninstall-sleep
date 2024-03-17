import json
import main
import trainer as tr
from flask import Flask, request
import summarizer as sumri

app = Flask(__name__)

app.secret_key = "UWUWUWUWUWU"
app.debug = True


@app.route("/")
def index():
    return "OK"


@app.route("/check", methods=["POST"])
def check():
    data = request.get_json(force=True)
    url_source = data["url"]
    main.process_test_url(url_source,'gui_url_features.csv')
    return_ans = tr.gui_caller('train_Data.csv','gui_url_features.csv')
    sumri.get_link(url_source)
    print(url_source)
    print(return_ans)
    return return_ans


@app.route("/check_html", methods=["POST"])
def check_html():
    data = request.get_json(force=True)
    url = data["url"]
    print(url)
    s = sumri.summary(url)
    return s


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=1240)
