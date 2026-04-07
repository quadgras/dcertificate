from flask import Blueprint, g, request
import sqlite3
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

@bp.get("/approval/list")
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
        "WHERE approval.issuer_id = ?"
        "AND approval.issuer_id != issuer.id;",  # Not listing own certificates' approvals
        (issuer_id,)
    ).fetchall()

    approvals = [dict(row) for row in query_response]

    return {
        "success": True,
        "data": approvals
    }, 200

@bp.delete("/approval/delete")
@require_issuer_login
def delete_approval():
    issuer_id = g.issuer_id
    request_json = request.json

    if 'certification_id' not in request_json:
        return {
            'success': False,
            'debug': 'certification_id not in request json.'
        }, 400
    
    db = get_db()

    query_response = db.execute(
        "SELECT * FROM approval "
        "WHERE issuer_id = ? "
        "AND certification_id = ?;",
        (issuer_id, request_json['certification_id'])
    ).fetchall()

    if(len(query_response) == 0):
        return {
            'success': False,
            'message': 'Certification with given id does not exist.'
        }, 404
    
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

@bp.get("/approval/certification/<certification_id>")
@require_issuer_login
def certification_for_approval(certification_id:int):
    issuer_id = g.issuer_id

    try:
        certification_id = int(certification_id)
    except ValueError:
        return {
            'success': False,
            'message': 'Invalid certification ID.',
            'debug': 'certification_id must be int.'
        }, 400
    
    db = get_db()

    query_response = db.execute(
        'SELECT certification.id AS id, '
        'certification.title AS title, '
        'issuer.display_name AS issuer_display_name ,'
        'certification.issuer_id AS issuer_id '
        'FROM certification '
        'LEFT JOIN issuer ON issuer.id = certification.issuer_id '
        'WHERE certification.id = ?;',
        (certification_id,)
    ).fetchall()

    if(len(query_response) == 0):
        return {
            'success': False,
            'message': 'Certification not found.'
        }, 404
    
    data = dict(query_response[0])
        
    return {
        'success': True,
        'data': data
    }, 200
    
@bp.delete("/approval/add")
@require_issuer_login
def add_approval():
    issuer_id = g.issuer_id
    try:
        certification_id = int(request.json['certification_id'])
    except KeyError:
        return {
            'success': False,
            'debug': 'certification_id not found in requested json.'
        }, 400
    except TypeError:
        return {
            'success': False,
            'message': 'Invalid certification ID.',
            'debug': 'certification_id must be int.'
        }, 400
    else:
    
        db = get_db()
        try:
            db.execute(
                'INSERT INTO approval '
                '(issuer_id, certification_id) '
                'VALUES (?,?);',
                (issuer_id, certification_id)
            )
        except sqlite3.IntegrityError:
            return {
                'success': False,
                'message': 'Approval already exists.'
            }
        else:
            db.commit()

            return {
                'success': True,
                'message': 'Approval added successfully.'
            }
