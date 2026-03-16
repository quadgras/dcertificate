import sqlite3
from datetime import datetime
import click
from flask import current_app, g

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types = sqlite3.PARSE_DECLTYPES
        )

        g.db.row_factory = sqlite3.Row

        return g.db
    
def close_db(e=None):
    db = g.pop('db', None)
    if(db): db.close()

@click.command('init-db')
def init_db():
    click.echo('Initialising database ...')
    db = get_db()
    with current_app.open_resource("schema/init_db.sql") as f:
        db.executescript(f.read().decode('utf8'))
    click.echo('Initialized the database.')

def init_app(app):
    # instruction to run close_db
    # when cleaning up after returning response
    app.teardown_appcontext(close_db)

    # adding the init_db command function to app
    app.cli.add_command(init_db)
