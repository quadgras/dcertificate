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
        "WHERE issuer_id = ? "
        "ORDER BY id ASC;",
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

@bp.post("/certification")
@require_issuer_login
def certification():
    request_json = request.json
    issuer_id = g.issuer_id
    db = get_db()

    validity_limit = int(request_json['validity_limit'])
    if(validity_limit == 0): validity_limit = None
    elif(validity_limit < 0): 
        return {
            'success': False,
            'message': 'Validity must be 0 or a positive integer.'
        }, 400


    if('certification_id' in request_json):
        # update request received
        certification_id = int(request_json.get('certification_id'))

        # issuer_id not required to make the update.
        # But it is added for security.
        # It ensures that another issuer 
        # cannot update other's certifications.
        # since issuer_id is extracted
        # from auth token
        # it can be trusted to be genuine.

        db.execute(
            'UPDATE certification '
            'SET pre_subject = ?, '
            'post_subject = ?, '
            'title = ?, '
            'validity_limit = ? '
            'WHERE id = ? AND issuer_id = ?;',
            (request_json.get('pre_subject', ''),
             request_json.get('post_subject', ''),
             request_json.get('title', ''), 
             validity_limit, certification_id, issuer_id)
        )

        db.commit()

        return {
            'success': True,
            'message': 'Record updated (if exists).'
        }, 200
    
    else:
        # add request received
        db.execute(
            'INSERT INTO certification '
            '(issuer_id, title, pre_subject, post_subject, validity_limit) '
            'VALUES (?,?,?,?,?);',
            (issuer_id, request_json['title'], request_json['pre_subject'],
             request_json['post_subject'], validity_limit)
        )

        id = dict(db.execute(
            'SELECT MAX(id) AS id FROM certification;'
        ).fetchone())['id']

        db.execute(
            'INSERT INTO approval (issuer_id, certification_id) '
            'VALUES (?,?);', (issuer_id, id)
        )

        db.commit()

        return {
            'success': True,
            'message': f'Certification added, ID {id}'
        }, 201
    
@bp.get("/certification-details/<certification_id>")
@require_issuer_login
def certification_details(certification_id:int):
    issuer_id = g.issuer_id

    try:
        certification_id = int(certification_id)
    except ValueError:
        return {
            'success': False,
            'message': 'Invalid certification ID.',
            'debug': 'certification_id must be positive integer.'
        }, 400
    
    db = get_db()

    query_response = db.execute(
        "SELECT * "
        "FROM certification "
        "WHERE id = ?;",
        (certification_id,)
    ).fetchall()

    if(len(query_response) == 0):
        return {
            'success': False,
            'message': 'Certification not found.'
        }, 404
    

    data = dict(query_response[0])

    return {
        "success": True,
        "data": data
    }, 200

@bp.get("/recipient-details/<recipient_id>")
@require_issuer_login
def recipient_details(recipient_id:int):
    try:
        recipient_id = int(recipient_id)
    except ValueError:
        return {
            "success": False,
            "message": "Invalid recipient id.",
            "debug": "Recipient ID must be a positive integer. Recieved non integer."
        }, 400
    
    if(recipient_id < 1):
        return {
            "success": False,
            "message": "Invalid recipient id.",
            "debug": "Recipient ID must be a positive integer. Recieved value < 1."
        }, 400

    db = get_db()

    details = db.execute(
        "SELECT id, username, display_name "
        "FROM recipient "
        "WHERE id = ?;", (recipient_id,)
    ).fetchone()

    if(details == None):
        return {
            "success": False,
            "message": f"Recipient with ID {recipient_id} not found."
        }, 404
    
    return {
        "success": True,
        "data": dict(details)
    }, 200

@bp.post('/issue-certificate')
@require_issuer_login
def issue_certificate():
    request_json = request.json
    certification_id = request_json.get('certification_id')
    recipient_id = request_json.get('recipient_id')
    issuer_id = g.issuer_id

    issue_time = lib.formatted_current_time()

    # for more robust dev experience
    # you can validate the request params here.

    # check if this issuer id is the owner of certification id
    # check if the recipient id exists
    # if all conditions are true: add the certificate to database

    db = get_db()

    query1_response = db.execute(
        'SELECT * FROM certification '
        'WHERE id = ? AND issuer_id = ?;',
        (certification_id, issuer_id)
    ).fetchone()
    
    if(query1_response == None):
        return {
            'success': False,
            'message': 'Certification ID: {} with issuer ID: {} not found.'.format(certification_id, issuer_id)
        }, 404
    
    query2_response = db.execute(
        'SELECT * FROM recipient '
        'WHERE id = ?;',
        (recipient_id,)
    ).fetchone()

    if(query2_response == None):
        return {
            'success': False,
            'message': 'Recipient ID: {recipient_id} not found.'
        }, 404
    
    # Execution reaches here implies
    # all preliminary checks passed.
    # Adding the certificate to database.

    try:
        query3_response = db.execute(
            'INSERT INTO certificat '
            '(recipient_id, certification_id, issue_time) '
            'VALUES (?,?,?);',
            (recipient_id, certification_id, issue_time)
        )
    except:
        return {
            'success': False,
            'message': 'Some error occured while adding certificate to database.'
        }, 500
    else:
        db.commit()

        return {
            'success': True,
            'message': 'Certificate issued and added to database.'
        }, 200