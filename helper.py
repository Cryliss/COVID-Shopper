from flask import make_response
import json

def return_json(arg):
    resp = make_response(json.dumps( arg, sort_keys = True, indent=4 ))
    resp.headers['Content-type'] = "application/json"
    return resp