from flask import (Blueprint, request, make_response, current_app, g)
from werkzeug.security import check_password_hash, generate_password_hash
import jwt, functools, datetime
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
        payload = {
            "username":username,"id":user['id'],
            "exp": datetime.datetime.now(tz=datetime.timezone.utc)+datetime.timedelta(seconds=current_app.config['JWT_EXPIRY_SEC'])},
        key = current_app.config['SECRET_KEY'],
        algorithm = "HS256"
    )

    res.set_cookie(
        key = "recepient_auth_token",
        value = token,
        httponly = True,
        samesite = "None", #'Lax',
        secure = True, #False, #(current_app.config['ENVIRONMENT'] == 'production') # send only over https on production
        path = "/"
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

def require_recepient_login(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if(g.get("recepient_username", None)):
            return view(**kwargs)
        else:
            return {
                "success": False,
                "message": "No recepient user logged in or token expired."
            }, 401
    
    return wrapped_view

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
        "SELECT * FROM issuer "
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
        payload = {
            "username":username,"id":user['id'],
            "exp": datetime.datetime.now(tz=datetime.timezone.utc)+datetime.timedelta(seconds=current_app.config['JWT_EXPIRY_SEC'])},
        key = current_app.config['SECRET_KEY'],
        algorithm = "HS256"
    )

    res.set_cookie(
        key = "issuer_auth_token",
        value = token,
        httponly = True,
        samesite = 'None',
        secure = True,
        path = "/"
    )

    return res

@bp.post("/issuer/logout")
def issuer_logout():
    res = make_response({
        "success":True,
        "message":"Logged out any active login."
    })
    res.delete_cookie('issuer_auth_token')
    return res

def require_issuer_login(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if(g.get("issuer_username",None)):
            return view(**kwargs)
        else:
            return {
                "success": False,
                "message": "No issuer user logged in or token expired."
            }
    
    return wrapped_view

@bp.before_app_request
def load_logged_in_user():
    recepient_token = request.cookies.get('recepient_auth_token', None)
    issuer_token = request.cookies.get('issuer_auth_token', None)
    
    #for key in request.cookies: print(key, ":", request.cookies[key]) #DEBUG
    if recepient_token:
        try:
            recepient = jwt.decode(
                jwt = recepient_token,
                key = current_app.config['SECRET_KEY'],
                algorithms = ["HS256"]
            )
        except jwt.ExpiredSignatureError:
            # JWT expired
            pass
        else:
            g.recepient_username = recepient['username']
            g.recepient_id = int(recepient['id'])

    if issuer_token:
        try:
            recepient = jwt.decode(
                jwt = issuer_token,
                key = current_app.config['SECRET_KEY'],
                algorithms = ["HS256"]
            )
        except jwt.ExpiredSignatureError:
            # JWT expired
            pass
        else:
            g.issuer_username = recepient['username']
            g.issuer_id = int(recepient['id'])