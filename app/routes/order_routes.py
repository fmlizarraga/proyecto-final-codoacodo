from flask import jsonify, request
from . import order_bp
from ..auth import requires_authorization
from app.services import order_service as ordersrv

@order_bp.route('/api/orders', methods=['GET'])
@requires_authorization
def get_orders():
    user_id = request.user_id
    is_ok, msg, code, orders_list = ordersrv.get_orders(user_id)
    return jsonify({"ok": is_ok, "message": msg, "orders": orders_list}), code

@order_bp.route('/api/orders', methods=['PUT'])
@requires_authorization
def create_order():
    user_id = request.user_id
    is_ok, msg, code, new_order = ordersrv.create_order(user_id)
    return jsonify({"ok": is_ok, "message": msg, "order": new_order}), code

@order_bp.route('/api/orders/<int:order_id>', methods=['GET'])
@requires_authorization
def get_order(order_id):
    is_ok, msg, code, order = ordersrv.get_one_order(order_id)
    return jsonify({"ok": is_ok, "message": msg, "order": order}), code