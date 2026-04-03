from flask import Blueprint, g
from dcertificate.db import get_db
from dcertificate.auth import require_recipient_login
import dcertificate.lib as lib
#import time

bp = Blueprint('recipient', __name__, url_prefix="/recipient")

@bp.get("/certificates-list")
@require_recipient_login
def certificates_list():
    #time.sleep(1) #DEBUG
    recipient_id = g.recipient_id
    db = get_db()

    # This query can be improved
    # to include a bool type valid parameter.
    # A certificate is invalid
    # if validity expired or certificate revoked.
    # If possible is SQL, then,
    # also construct certificate_no
    # and add it to a column/field.
    query_data = db.execute(
        "SELECT certificat.issue_time AS issue_time, "
        "certificat.certification_id AS certification_id, "
        "certificat.revoke_message AS revoke_message, "
        "certification.validity_limit as validity_limit, "
        "certification.title AS title, "
        "issuer.display_name AS issuer_display_name "
        "FROM certificat "
        "LEFT JOIN certification ON certificat.certification_id = certification.id "
        "LEFT JOIN issuer ON certification.issuer_id = issuer.id "
        "WHERE certificat.recipient_id = ?;",
        (recipient_id,)
    ).fetchall()

    certificate_previews = []

    for row in query_data:
        certificate_previews.append({
            'certificate_id': lib.form_certificate_id(row["issue_time"], row["certification_id"], recipient_id),
            'issue_time': row["issue_time"],
            'title': row["title"],
            'issuer_display_name': row["issuer_display_name"],
            'valid': lib.is_certificate_valid(row["revoke_message"], row["issue_time"], row["validity_limit"])
        })
    
    return {
        "success": True,
        "data": certificate_previews
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

    return {
        "success": True,
        "data": dict(details)
    }, 200
