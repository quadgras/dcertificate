from flask import Blueprint
from dcertificate.db import get_db

bp = Blueprint('recepient', __name__, url_prefix="/recepient")
