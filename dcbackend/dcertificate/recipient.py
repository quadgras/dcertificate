from flask import Blueprint, g
from dcertificate.db import get_db
from dcertificate.auth import require_recipient_login
import time

bp = Blueprint('recipient', __name__, url_prefix="/recipient")

@bp.get("/certificates-list")
@require_recipient_login
def certificates_list():
    time.sleep(1) #DEBUG
    recipient_id = g.recipient_id
    db = get_db()

    # This query can be improved
    # to include a bool type valid parameter.
    # A certificate is invalid
    # if validity expired or certificate revoked.
    # If possible is SQL, then,
    # also construct certificate_no
    # and add it to a column/field.
    certificates = db.execute(
        "SELECT certificat.issue_date AS issue_date, "
        "certificat.certification_id AS certification_id, "
        "certification.title AS title "
        "FROM certificat "
        "LEFT JOIN certification "
        "ON certificat.certification_id = certification.id "
        "WHERE certificat.recipient_id = ?;",
        (recipient_id,)
    ).fetchall()

    certificates = [dict(c) for c in certificates]
    # DEBUG
    print(certificates)
    
    return {
        "success": True,
        "data": certificates
    }, 200

@bp.get("/account-details")
@require_recipient_login
def account_details():
    recipient_id = g.recipient_id
    db = get_db()

    details = db.execute(
        "SELECT id, username, display_name "
        "FROM recipient "
        "WHERE id = ?;", (recipient_id,)
    ).fetchone()

    time.sleep(1) #DEBUG

    return {
        "success": True,
        "data": dict(details)
    }, 200
