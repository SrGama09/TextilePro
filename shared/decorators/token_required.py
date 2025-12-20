from functools import wraps
from flask import request, jsonify
from shared.security import decode_access_token


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Token is missing"}), 401

        try:
            token = auth_header.split(" ")[1]
            payload = decode_access_token(token)
            if not payload:
                return jsonify({"error": "Invalid token"}), 401
        except Exception as e:
            return jsonify({"error": f"Invalid token format, error: {str(e)}"}), 401

        return f(payload, *args, **kwargs)
    return decorated
