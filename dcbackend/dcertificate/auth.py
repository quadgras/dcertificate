from flask import (Blueprint, request, make_response, current_app, g)
from werkzeug.security import check_password_hash, generate_password_hash
import jwt, functools, datetime, time
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


@bp.post("/recipient/register")
def recipient_register():
    try:
        username = request.json["username"] #request.form.get("username")
        password = request.json["password"]
        display_name = request.json["display_name"]
    except KeyError:
    #if(not(username and password and display_name)): # use instead of KeyError while dealing with formdata
        return {
            "success": False,
            "debug": "One or more from username, "
                     "password & display_name missing "
                     "from POST request body."
        }, 400
    
    db = get_db()
    try:
        db.execute(
            "INSERT INTO recipient "
            "(username, display_name, pasword)"
            "VALUES (?, ?, ?)",
            (username, display_name, generate_password_hash(password))
        )
    except db.IntegrityError:
        return {
            "success": False,
            "message": "Username already exists."
        }, 400
    else:
        db.commit()
    
    return {
        "success": True,
        "message": "User {} successfully registered.".format(username)
    }, 201

@bp.post("/recipient/login")
def recipient_login():
    time.sleep(2) #DEBUG
    try:
        username = request.json["username"]
        password = request.json["password"]
    except KeyError:
        return {
            "success": False,
            "debug": "Keys: username or password "
                     "is missing from request data."
        }, 400
    
    db = get_db()
    user = db.execute(
        "SELECT * FROM recipient "
        "WHERE username = ?;",
        (username,)
    ).fetchone()

    if(not user):
        return {
            "success": False,
            "message": "Username {} not found.".format(username),
            "info": [
                "New account can be registered."
            ]
        }, 401
    
    if(not check_password_hash(user['pasword'], password)):
        return {
            "success": False,
            "message": "Invalid password."
        }, 401
    
    # At this stage, user is valid.
    # Hence granting access.

    res = make_response({
        "success": True,
        "data": {'username': username, 'display_name': user['display_name']}
    }, 200)
    
    token = jwt.encode(
        payload = {
            "username":username,"id":user['id'],
            "exp": datetime.datetime.now(tz=datetime.timezone.utc)+datetime.timedelta(seconds=current_app.config['JWT_EXPIRY_SEC'])},
        key = current_app.config['SECRET_KEY'],
        algorithm = "HS256"
    )

    res.set_cookie(
        key = "recipient_auth_token",
        value = token,
        httponly = True,
        samesite = "None", #'Lax',
        secure = True, #False, #(current_app.config['ENVIRONMENT'] == 'production') # send only over https on production
        path = "/"
    )

    return res

@bp.delete("/recipient/logout")
def recipient_logout():
    res = make_response({
        "success":True,
        "message":"Logged out."
    }, 200)
    res.delete_cookie('recipient_auth_token')
    time.sleep(1) #DEBUG
    return res

def require_recipient_login(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if(g.get("recipient_username", None)):
            return view(**kwargs)
        else:
            return {
                "success": False,
                "message": "No recipient user logged in or token expired."
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
            "debug": "One or more from username, "
                     "password & display_name missing "
                     "from POST request body."
        }, 400
    
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
        }, 400
    else:
        db.commit()
    
    return {
        "success": True,
        "message": "User {} successfully registered.".format(username)
    }, 201

@bp.post("/issuer/login")
def issuer_login():
    try:
        username = request.json["username"]
        password = request.json["password"]
    except KeyError:
        return {
            "success": False,
            "debug": "Keys: username or password "
                     "is missing from request data."
        }, 400
    
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
        }, 401
    
    if(not check_password_hash(user['pasword'], password)):
        return {
            "success": False,
            "message": "Invalid password."
        }, 401
    
    # At this stage, user is valid.
    # Hence granting access.

    res = make_response({
        "success": True,
        "message": "User logged in successfully."
    }, 200)
    
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

@bp.delete("/issuer/logout")
def issuer_logout():
    res = make_response({
        "success":True,
        "message":"Logged out any active login."
    }, 200)
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
            }, 401
    
    return wrapped_view

@bp.before_app_request
def load_logged_in_user():
    recipient_token = request.cookies.get('recipient_auth_token', None)
    issuer_token = request.cookies.get('issuer_auth_token', None)
    
    if recipient_token:
        try:
            recipient = jwt.decode(
                jwt = recipient_token,
                key = current_app.config['SECRET_KEY'],
                algorithms = ["HS256"]
            )
        except jwt.ExpiredSignatureError:
            # JWT expired
            pass
        else:
            g.recipient_username = recipient['username']
            g.recipient_id = int(recipient['id'])

    if issuer_token:
        try:
            recipient = jwt.decode(
                jwt = issuer_token,
                key = current_app.config['SECRET_KEY'],
                algorithms = ["HS256"]
            )
        except jwt.ExpiredSignatureError:
            # JWT expired
            pass
        else:
            g.issuer_username = recipient['username']
            g.issuer_id = int(recipient['id'])