from flask import Blueprint, g
from dcertificate.db import get_db
from dcertificate.auth import require_recepient_login
import time

bp = Blueprint('recepient', __name__, url_prefix="/recepient")

@bp.post("/certificates-list")
@require_recepient_login
def certificates_list():
    time.sleep(1) #DEBUG
    recepient_id = g.recepient_id
    db = get_db()

    # This query can be improved
    # to include a bool type valid parameter.
    # A certificate is invalid
    # if validity expired or certificate revoked.
    certificates = db.execute(
        "SELECT certificat.issue_date AS issue_date, "
        "certificat.certification_id AS certification_id, "
        "certification.title AS title "
        "FROM certificat "
        "LEFT JOIN certification "
        "ON certificat.certification_id = certification.id "
        "WHERE certificat.recepient_id = ?;",
        (recepient_id,)
    ).fetchall()

    # DEBUG
    print(certificates)
    
    return certificates

@bp.post("/account-details")
@require_recepient_login
def account_details():
    recepient_id = g.recepient_id
    db = get_db()

    details = db.execute(
        "SELECT id, username, display_name "
        "FROM recepient "
        "WHERE id = ?;", (recepient_id,)
    ).fetchone()

    time.sleep(1) #DEBUG

    return dict(details), 200
