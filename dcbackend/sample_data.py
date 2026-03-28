# this file is used to populate sample data
# on empty database file.
# It is useful while testing.

import sqlite3
import os
from werkzeug.security import generate_password_hash

instance_folder = os.environ.get('INSTANCE_FOLDER')
if(not instance_folder):
    print("INSTANCE_FOLDER environment variable not found.")
    exit(1)

db_file = "{}/db.sqlite".format(instance_folder)

db = sqlite3.connect(
    db_file,
    detect_types = sqlite3.PARSE_DECLTYPES
)

db.execute(
    "INSERT INTO recepient "
    "(username, display_name, pasword) VALUES "
    "(?, ?, ?);",
    ("recepient1", "Recepient 1", generate_password_hash("recepient1_password"))
)

db.execute(
    "INSERT INTO issuer "
    "(username, display_name, pasword) VALUES "
    "(?, ?, ?);",
    ("issuer1", "Issuer 1", generate_password_hash("issuer1_password"))
)

db.execute(
    "INSERT INTO certification "
    "(issuer_id, title, detail, validity_limit) VALUES "
    "(?, ?, ?, ?),(?, ?, ?, ?);",
    (1, "Publisher 2026", "published research paper.", 360,
     1, "Innovator 2026", "did an innovation.", None)
)

db.execute(
    "INSERT INTO certificat "
    "(recepient_id, certification_id, issue_date, validity_limit, revoke_message) VALUES "
    "(?,?,?,?,?), (?,?,?,?,?), (?,?,?,?,?);",
    (1,1,"2026-03-01",None, None, 1,1,"2026-03-10",None,None,
     1,2,"2026-03-15",None,None)
)

db.commit()
db.close()