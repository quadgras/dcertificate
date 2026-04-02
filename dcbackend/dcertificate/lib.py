from datetime import datetime, timezone

# issue_time string for reference
# "YYYY-MM-DD HH:MM:SS"
# certificate id for reference 
# YYYYMMDDHHMMSS-<certification-id>-<recipient id>
# NOTE: backend is designed
#       to receive, store, transmit and operate
#       on UTC datetime only.
#       Convert the datetime to local timezone
#       on frontend.

def form_certificate_id(issue_time, certification_id, recipient_id):
    certificate_id = ""
    for character in issue_time:
        if(character.isalnum()):
            certificate_id += character
    certificate_id += f'-{certification_id}-{recipient_id}'
    return certificate_id

def parse_certificate_id(certificate_id):
    i_time, c_id, r_id = certificate_id.split('-')
    certification_id = int(c_id)
    recipient_id = int(r_id)
    issue_time = "{}-{}-{} {}:{}:{}".format(
        i_time[0:4], i_time[4:6], i_time[6:8],
        i_time[8:10], i_time[10:12], i_time[12:14]
    )
    return issue_time, certification_id, recipient_id

def is_certificate_valid(revoke_message, issue_time, validity_limit):
    if(revoke_message): return False
    if(validity_limit == None): return True
    return ((datetime.now(timezone.utc)-
             datetime.strptime(issue_time,'%Y-%m-%d %H:%M:%S').replace(tzinfo=timezone.utc)
            ).days < validity_limit
        )

def formatted_current_time():
    '''Returns current time string according to backend format.'''

    return datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')