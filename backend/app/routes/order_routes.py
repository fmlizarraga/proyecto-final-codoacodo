from flask import jsonify, request
from . import order_bp
from ..auth import requires_authorization

@order_bp.route('/api/orders', methods=['GET'])
def get_orders():
    return jsonify({"ok": True, "message": "Ordenes de compra recuperadas correctamente."})

@order_bp.route('/api/orders', methods=['POST'])
def create_order():
    return jsonify({"ok": True, "message": "Orden de compra creada correctamente."})

@order_bp.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    return jsonify({"ok": True, "message": "Orden de compra recuperada correctamente.", "order": {"id": order_id}})