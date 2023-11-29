from flask import jsonify, request
from . import cart_bp
from ..auth import requires_authorization

@cart_bp.route('/api/cart', methods=['GET'])
@requires_authorization
def get_cart():
    print(request.user_id)
    cart = [{"product": {
        "id": "123",
        "title": "Silla",
        "price": 12.99,
        "description": "Una silla muy comoda",
        "img": "/public/pictures/product_silla01.jpg"
    }, "quantity": 2}]
    return jsonify({"ok": True, "message": "Carrito recuperado correctamente.", "cart": cart})

@cart_bp.route('/api/cart', methods=['POST'])
@requires_authorization
def add_to_cart():
    cart = [{"product": {
        "id": "123",
        "title": "Silla",
        "price": 12.99,
        "description": "Una silla muy comoda",
        "img": "/public/pictures/product_silla01.jpg"
    }, "quantity": 2}]
    return jsonify({"ok": True, "message": "Agregado correctamente al carrito.", "cart": cart})

@cart_bp.route('/api/cart/remove/<int:product_id>', methods=['DELETE'])
@requires_authorization
def remove_from_cart(product_id):
    cart = [{"product": {
        "id": "123",
        "title": "Silla",
        "price": 12.99,
        "description": "Una silla muy comoda",
        "img": "/public/pictures/product_silla01.jpg"
    }, "quantity": 2}]
    return jsonify({"ok": True, "message": "Removido correctamente al carrito.", "cart": cart})

@cart_bp.route('/api/cart/clear', methods=['DELETE'])
@requires_authorization
def clear_cart():
    return jsonify({"ok": True, "message": "Carrito limpiado correctamente."})