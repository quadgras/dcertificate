DROP TABLE IF EXISTS issuer;
DROP TABLE IF EXISTS recipient;
DROP TABLE IF EXISTS certificat; /*certificate is a keyword*/
DROP TABLE IF EXISTS certification;
DROP TABLE IF EXISTS approval;

CREATE TABLE recipient(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    pasword TEXT NOT NULL /*password is a keyword*/
);

CREATE TABLE issuer(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    pasword TEXT NOT NULL 
);

CREATE TABLE certification(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issuer_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    pre_subject TEXT NOT NULL,  /*Text appearing before subject name on certificate.*/
    post_subject TEXT NOT NULL, /*Text appearing after subject name on certificate.*/
    validity_limit INTEGER, /* No. of days. NULL means infinite */
    FOREIGN KEY (issuer_id) REFERENCES issuer (id)
    UNIQUE(issuer_id, title) /* Enforce unique title among certifications of a particular issuer */
);

CREATE TABLE certificat(
    recipient_id INTEGER NOT NULL,
    certification_id INTEGER NOT NULL,
    issue_time TEXT NOT NULL,
    revoke_message TEXT, /* Not NULL indicates certificate has been revoked */
    UNIQUE(recipient_id, certification_id, issue_time), /* On a given time (floor of second), a candidate can receive only one certificate from a certification*/
    FOREIGN KEY (recipient_id) REFERENCES recipient (id),
    FOREIGN KEY (certification_id) REFERENCES certification (id)
);

CREATE TABLE approval(
    issuer_id INTEGER NOT NULL,
    certification_id INTEGER NOT NULL,
    FOREIGN KEY (issuer_id) REFERENCES issuer (id),
    FOREIGN KEY (certification_id) REFERENCES certification(id),
    UNIQUE(issuer_id, certification_id)  /* prevents duplicate entries */
);