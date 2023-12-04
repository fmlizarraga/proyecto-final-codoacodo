from flask import jsonify, request
from . import cart_bp
from ..auth import requires_authorization
from app.validators import validate_update_cart_item, isPositive
from app.services import cart_service as cartsrv

@cart_bp.route('/api/cart', methods=['GET'])
@requires_authorization
def get_cart():
    user_id = request.user_id
    
    is_ok, message, code, cart = cartsrv.get_my_cart(user_id)
    
    return jsonify({"ok": is_ok, "message": message, "cart": cart}), code

@cart_bp.route('/api/cart', methods=['POST'])
@requires_authorization
def add_to_cart():
    user_id = request.user_id
    data = request.get_json()
    
    if not validate_update_cart_item(data):
        return jsonify({"ok": False, "message": "Campos faltantes o erroneos."}), 400
    
    is_ok, message, code, cart = cartsrv.add_or_remove_from_cart(user_id, data['id'], data['quantity'])
    
    return jsonify({"ok": is_ok, "message": message, "cart": cart}), code

@cart_bp.route('/api/cart/remove/<int:product_id>', methods=['DELETE'])
@requires_authorization
def remove_from_cart(product_id):
    user_id = request.user_id
    if not isPositive(product_id):
        return jsonify({"ok": False, "message": "ID de producto invalodo"}), 400
    
    is_ok, message, code, cart = cartsrv.delete_from_cart(user_id,product_id)
    
    return jsonify({"ok": is_ok, "message": message, "cart": cart}), code

@cart_bp.route('/api/cart/clear', methods=['DELETE'])
@requires_authorization
def clear_cart():
    user_id = request.user_id
    is_ok, message, code = cartsrv.empty_cart(user_id)
    return jsonify({"ok": is_ok, "message": message}), code