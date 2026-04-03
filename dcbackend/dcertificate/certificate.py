from flask import Blueprint
from dcertificate.db import get_db
import dcertificate.lib as lib

bp = Blueprint('certificate', __name__, url_prefix='/certificate')

@bp.get('/details/<certificate_id>')
def details(certificate_id):
    try:
        issue_time, certification_id, recipient_id = lib.parse_certificate_id(certificate_id)
    except:
        return {
            "success": False,
            "debug": "Error while parsing certificate_id. Ensure correct format."
        }, 400

    db = get_db()

    # DEBUG
    # This is a big join.
    # To optimize, try that 
    # the joins are ordered such that
    # previous join results in least rows
    # compared to any other pair.
    # Maybe where is also useful in optimization.
    # Bad join may result in O(n^4) operations.

    query_data = db.execute(
        "SELECT "
        "certificat.issue_time AS issue_time, "
        "certificat.revoke_message AS revoke_message, "
        "certification.title AS title, "
        "certification.pre_subject AS pre_subject, "
        "certification.post_subject AS post_subject, "
        "certification.validity_limit AS validity_limit, "
        "issuer.username AS issuer_username, "
        "issuer.display_name AS issuer_display_name, "
        "recipient.username AS recipient_username, "
        "recipient.display_name AS recipient_display_name, "
        "approver.username AS approver_username, "
        "approver.display_name AS approver_display_name "
        "FROM certificat "
        "LEFT JOIN recipient ON recipient.id = certificat.recipient_id "
        "LEFT JOIN certification ON certification.id = certificat.certification_id "
        "LEFT JOIN issuer ON issuer.id = certification.issuer_id "
        "LEFT JOIN approval ON approval.certification_id = certification.id "
        "LEFT JOIN issuer as approver ON approver.id = approval.issuer_id "
        "WHERE certificat.recipient_id = ? "
        "AND certificat.certification_id = ? "
        "AND certificat.issue_time = ?;",
        (recipient_id, certification_id, issue_time)
    ).fetchall()

    # if query data is empty, then no certificate found
    if(query_data == []):
        return {"success": False, "message": "Certificate not found."}, 404
    
    # forming complete certificate details from query data
    certificate_details = dict(query_data[0])
    certificate_details['certificate_id'] = certificate_id
    certificate_details['valid'] = lib.is_certificate_valid(
        certificate_details['revoke_message'],
        certificate_details['issue_time'],
        certificate_details['validity_limit']
    )

    # collecting approver display names
    # (other than the issuer itself)
    # and adding it to certificate_details
    if(certificate_details['approver_username'] == certificate_details['issuer_username']):
        certificate_details['other_approvers'] = []
    else:
        certificate_details['other_approvers'] = [certificate_details['approver_display_name']]
    del certificate_details['approver_username'], certificate_details['approver_display_name']

    for row in query_data[1:]:
        if(row['approver_username'] != row['issuer_username']):
            certificate_details['other_approvers'].append(row['approver_display_name'])

    return {
        "success": True,
        "data": certificate_details
    }, 200
    