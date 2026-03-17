from flask import (Blueprint, request, make_response, current_app)
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
from dcertificate.db import get_db

bp = Blueprint('auth', __name__, url_prefix="/auth")

# not able to use this because
# using it results in error
# TypeError: Object of ResponseStatus is not JSON seriazable.
# class ResponseStatus(Enum):
#     success = "true"
#     fail = "false"

# NOTE: unless stated explicitly,
# all these APIs will accept JSON
# and not formdata.
# The decision is made because
# JSON adds little bit of more
# protection agains CSRF attacks
# that can be implemented using web-forms.
# Although, to accept files,
# formdata may be used.


@bp.post("/recepient/register")
def recepient_register():
    try:
        username = request.json["username"] #request.form.get("username")
        password = request.json["password"]
        display_name = request.json["display_name"]
    except KeyError:
    #if(not(username and password and display_name)): # use instead of KeyError while dealing with formdata
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
    try:
        username = request.json["username"]
        password = request.json["password"]
    except KeyError:
        return {
            "success": False,
            "message": "Keys: username or password "
                       "is missing from request data."
        }
    
    db = get_db()
    user = db.execute(
        "SELECT * FROM recepient "
        "WHERE username = ?;",
        (username,)
    ).fetchone()

    if(not user):
        return {
            "success": False,
            "message": "Username {} not found.".format(username)
        }
    
    if(not check_password_hash(user['pasword'], password)):
        return {
            "success": False,
            "message": "Invalid password."
        }
    
    # At this stage, user is valid.
    # Hence granting access.

    res = make_response({
        "success": True,
        "message": "User logged in successfully."
    })
    
    token = jwt.encode(
        payload = {"username":username,"id":user['id']},
        key = current_app.config['SECRET_KEY'],
        algorithm = "HS256"
    )

    res.set_cookie(
        key = "recepient_auth_token",
        value = token,  # setting JWT recommended
        httponly = True,
        samesite = 'none',
        secure = (current_app.config['ENVIRONMENT'] == 'production') # enforce https on production
    )

    return res

@bp.post("/recepient/logout")
def recepient_logout():
    res = make_response({
        "success":True,
        "message":"Logged out any active login."
    })
    res.delete_cookie('recepient_auth_token')
    return res

@bp.post("/issuer/register")
def issuer_register():
    try:
        username = request.json["username"]
        password = request.json["password"]
        display_name = request.json["display_name"]
    except KeyError:
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