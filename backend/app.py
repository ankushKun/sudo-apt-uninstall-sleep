import json
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
    html_source = data["html_source"]
    print(html_source)

    return "IDK"


if __name__ == "__main__":
    app.run()
