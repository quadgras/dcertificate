from flask import Blueprint, g
from dcertificate.db import get_db

bp = Blueprint('certificate', __name__, url_prefix='/certificate')