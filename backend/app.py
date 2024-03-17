import json
import main
import trainer as tr
from flask import Flask, request

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
    print(url_source)

    return return_ans


if __name__ == "__main__":
    app.run()
