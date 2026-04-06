from flask import Blueprint, g, request
from dcertificate.db import get_db
from dcertificate.auth import require_issuer_login
import dcertificate.lib as lib

bp = Blueprint('issuer', __name__, url_prefix="/issuer")

@bp.get("/certifications-list")
@require_issuer_login
def certifications_list():
    issuer_id = g.issuer_id
    db = get_db()

    query_response = db.execute(
        "SELECT id, title "
        "FROM certification "
        "WHERE issuer_id = ?;",
        (issuer_id,)
    ).fetchall()

    certifications = [dict(row) for row in query_response]

    return {
        "success": True,
        "data": certifications
    }, 200

@bp.get("approvals-list")
@require_issuer_login
def approvals_list():
    issuer_id = g.issuer_id
    db = get_db()

    query_response = db.execute(
        "SELECT "
        "certification.id AS certification_id, "
        "certification.title AS certification_title, "
        "issuer.username AS issuer_username, "
        "issuer.display_name AS issuer_display_name "
        "FROM approval "
        "LEFT JOIN certification ON certification.id = approval.certification_id "
        "LEFT JOIN issuer ON issuer.id = certification.issuer_id "
        "WHERE approval.issuer_id = ?;",
        (issuer_id,)
    ).fetchall()

    approvals = [dict(row) for row in query_response]

    return {
        "success": True,
        "data": approvals
    }, 200

@bp.delete("/delete-approval")
@require_issuer_login
def delete_approval():
    issuer_id = g.issuer_id
    request_json = request.json
    db = get_db()

    query_response = db.execute(
        "DELETE FROM approval "
        "WHERE issuer_id = ? "
        "AND certification_id = ?;",
        (issuer_id, request_json['certification_id'])
    )

    db.commit()

    return {
        "success": True,
        "message": "Approval deleted."
    }, 200