from flask import Flask
import os

instance_folder = os.environ.get('INSTANCE_FOLDER', "")
if(instance_folder == ""):
    print(
        "Error: "
        "Environment variable INSTANCE_FOLDER "
        "is not defined or is empty string."
    )
    exit(1)

def create_app():
    # exist_ok=True stops the process but
    # doesn't throw an error if
    # folder already exists.
    os.makedirs(instance_folder, exist_ok=True)

    app = Flask(__name__)

    @app.get("/hi")
    def hi():
        return {"message": "Hi"}, 200
    
    return app