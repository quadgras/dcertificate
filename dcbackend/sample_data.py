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
    "INSERT INTO recipient "
    "(username, display_name, pasword) VALUES "
    "(?, ?, ?);",
    ("recipient1", "Recipient 1", generate_password_hash("recipient1_password"))
)

db.execute(
    "INSERT INTO issuer "
    "(username, display_name, pasword) VALUES "
    "(?, ?, ?), (?, ?, ?), (?, ?, ?);",
    ("issuer1", "Issuer 1", generate_password_hash("issuer1_password"),
     "issuer2", "Issuer 2", generate_password_hash("issuer2_password"),
     "issuer3", "Issuer 3", generate_password_hash("issuer3_password")
    )
)

db.execute(
    "INSERT INTO certification "
    "(issuer_id, title, detail, validity_limit) VALUES "
    "(?, ?, ?, ?),(?, ?, ?, ?),(?, ?, ?, ?),(?, ?, ?, ?);",
    (1, "COO 2025", "is designated Chief Operations Officer for one year.", 365,
     1, "Innovator 2026", "did an innovation.", None,
     2, "HOO 2026", "is assigned head of organization for two years.", 730,
     3, "Guest Student", "is a guest student of our organization.", None)
)

db.execute(
    "INSERT INTO certificat "
    "(recipient_id, certification_id, issue_time, revoke_message) VALUES "
    "(?,?,?,?), (?,?,?,?), (?,?,?,?), (?,?,?,?), (?,?,?,?), (?,?,?,?);",
    (1,1,"2025-03-01 12:12:00", None, 1,2,"2026-03-10 12:12:00",None,
     1,2,"2026-03-15 20:10:01","Candidate was found over-aged.",
     1,3,"2026-03-15 20:10:01",None, 1,2,"2026-03-16 20:10:01",None,
     1,4,"2026-03-15 20:10:02","He left the organization.")
)

db.execute(
    "INSERT INTO approval "
    "(issuer_id, certification_id) VALUES "
    "(?,?), (?,?);",
    (2,2, 3,2)
)

db.commit()
db.close()