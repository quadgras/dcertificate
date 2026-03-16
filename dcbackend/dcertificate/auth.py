from flask import Blueprint, request
from werkzeug.security import check_password_hash, generate_password_hash
from dcertificate.db import get_db

bp = Blueprint('auth', __name__, url_prefix="/auth")

# not able to use this because
# using it results in error
# TypeError: Object of ResponseStatus is not JSON seriazable.
# class ResponseStatus(Enum):
#     success = "true"
#     fail = "false"

# NOTE: unless stated explicitly,
# all these APIs will accept formdata
# and not JSON.
# The decision is made because
# formdata supports file uploads too
# while JSON does not.
# File uploads may be needed in future.

@bp.post("/recepient/register")
def recepient_register():
    username = request.form.get("username") #request.json["username"]
    password = request.form.get("password")
    display_name = request.form.get("display_name")
    if(not(username and password and display_name)):
        return {
            "success": False,
            "message": "One or more from username, "
                       "password & display_name missing "
                       "from POST request body."
        }
    
    db = get_db()
    try:
        db.execute(
            "INSERT INTO recepient "
            "(username, display_name, pasword)"
            "VALUES (?, ?, ?)",
            (username, display_name, generate_password_hash(password))
        )
    except db.IntegrityError:
        return {
            "success": False,
            "message": "Username already exists."
        }
    else:
        db.commit()
    
    return {
        "success": True,
        "message": "User {} successfully registered.".format(username)
    }

@bp.post("/recepient/login")
def recepient_login():

    return {}

@bp.post("/issuer/register")
def issuer_register():
    username = request.form.get("username")
    password = request.form.get("password")
    display_name = request.form.get("display_name")
    if(not(username and password and display_name)):
        return {
            "success": False,
            "message": "One or more from username, "
                       "password & display_name missing "
                       "from POST request body."
        }
    
    db = get_db()
    try:
        db.execute(
            "INSERT INTO issuer "
            "(username, display_name, pasword)"
            "VALUES (?, ?, ?)",
            (username, display_name, generate_password_hash(password))
        )
    except db.IntegrityError:
        return {
            "success": False,
            "message": "Username already exists."
        }
    else:
        db.commit()
    
    return {
        "success": True,
        "message": "User {} successfully registered.".format(username)
    }

@bp.post("/issuer/login")
def issuer_login():

    return {}

def require_issuer_login():
    pass

def require_recepient_login():
    pass