from flask import Blueprint
from dcertificate.db import get_db

bp = Blueprint('issuer', __name__, url_prefix="/issuer")

