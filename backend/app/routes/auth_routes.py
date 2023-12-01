from flask import jsonify, request
from . import auth_bp
from ..auth import requires_authorization
from app.validators import validate_user_register, validate_login
from app.services import auth_service as authsrv

@auth_bp.route('/api/auth', methods=['PUT'])
def register():
    data = request.get_json()
    
    is_valid = validate_user_register(data)
    if not is_valid:
        return jsonify({"ok": False, "message": "Alguno de los campos falta o esta en un formato incorrecto."}), 400
    
    is_ok, message, code = authsrv.register_user(data)
    
    return jsonify({"ok": is_ok, "message": message}), code

@auth_bp.route('/api/auth', methods=['POST'])
def login():
    data = request.get_json()
    
    is_valid = validate_login(data)
    if not is_valid:
        return jsonify({"ok": False, "message": "Alguno de los campos falta o esta en un formato incorrecto."}), 400
    
    is_ok, message, code, res_user, token = authsrv.login_user(data['email'],data['password'])
    
    if is_ok:
        return jsonify({"ok": is_ok, "message": message,  "user": res_user, "token": token})
    
    return jsonify({"ok": is_ok, "message": message}), code

@auth_bp.route('/api/auth/', methods=['GET'])
@requires_authorization
def check():
    user_id = request.user_id
    token = authsrv.generate_token(user_id)
    return jsonify({"ok": True, "message": "Autorizacion renovada correctamente.", "token": token})