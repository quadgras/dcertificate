from flask import Flask
from flask_cors import CORS
import os, json
import dcertificate.db as db
import dcertificate.auth
import dcertificate.issuer
import dcertificate.recepient

instance_folder = os.environ.get('INSTANCE_FOLDER', "")
if(instance_folder == ""):
    print(
        "Error: "
        "Environment variable INSTANCE_FOLDER "
        "is not defined or is empty string. "
        "Please create instance folder, "
        "add config.json file there and "
        "set INSTANCE_FOLDER environment variable "
        "on the terminal."
    )
    exit(1)

def create_app():
    #os.makedirs(instance_folder, exist_ok=True)
    # above statement not needed
    # since instance_folder must be
    # setup manually with config.

    app = Flask(__name__)

    # loading and setting config
    app.config.from_file(
        filename=os.path.join(instance_folder,'config.json'),
        load=json.load
    )
    app.config['DATABASE'] = os.path.join(instance_folder, 'db.sqlite')

    # adding db functionality to app
    db.init_app(app)

    # registring blueprints
    app.register_blueprint(dcertificate.auth.bp)
    app.register_blueprint(dcertificate.issuer.bp)
    app.register_blueprint(dcertificate.recepient.bp)

    # adding CORS config
    CORS(
        app, supports_credentials=True,
        origins=[app.config['FRONTEND_URL']]
    )

    @app.get("/hi")
    def hi():
        return {"message": "Hi"}, 200
    
    return app