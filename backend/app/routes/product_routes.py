from flask import jsonify, request
from . import product_bp
from ..auth import requires_authorization
from app.validators import validate_new_product_data, validate_existent_product_data, isValidInt
from app.services import product_service as prsrv

@product_bp.route('/api/products', methods=['GET'])
@requires_authorization
def get_products():
    data = prsrv.fetch_products()
    return jsonify({"ok":True, "message":"Productos recuperados correctamente", "products": data})

@product_bp.route('/api/products', methods=['POST'])
@requires_authorization
def create_product():
    auth_lvl = request.auth_lvl
    if not auth_lvl == 'admin':
        return jsonify({"ok": False, "message": "Usuario no autorizado para realizar esta accion"}), 403
    
    data = request.get_json() # Cuerpo de la peticion HTTP
    
    # validaciones del cuerpo de la peticion
    if not validate_new_product_data(data):
        return jsonify({"ok": False, "message": "Alguno de los campos falta o esta en un formato incorrecto."}), 400
    
    is_ok, msg, code, new_product = prsrv.create_product(data)
    
    return jsonify({"ok": is_ok, "message": msg, "product": new_product}), code

@product_bp.route('/api/products/<int:product_id>', methods=['PUT'])
@requires_authorization
def update_product(product_id):
    auth_lvl = request.auth_lvl
    if not auth_lvl == 'admin':
        return jsonify({"ok": False, "message": "Usuario no autorizado para realizar esta accion"}), 403
    
    data = request.get_json()
    
    if not validate_existent_product_data(data, product_id):
        return jsonify({"ok": False, "message": "Alguno de los campos falta o esta en un formato incorrecto."}), 400
    
    updated_product = prsrv.update_product(data, product_id)
    
    if updated_product == None:
        return jsonify({"ok": False, "message": "Hubo un problema al tratar de actualizar el producto."}), 503
    
    return jsonify({"ok":True,"product:": updated_product, "message": "Producto actualizado correctamente."})

@product_bp.route('/api/products/<int:product_id>', methods=['DELETE'])
@requires_authorization
def delete_product(product_id):
    auth_lvl = request.auth_lvl
    if not auth_lvl == 'admin':
        return jsonify({"ok": False, "message": "Usuario no autorizado para realizar esta accion"}), 403
    
    if not isValidInt(product_id):
        return jsonify({"ok": False, "message": "Identificador de recurso invalido."}), 400
    
    is_found = prsrv.find_product(product_id)
    if not is_found:
        return jsonify({"ok": False, "message": "No se encuntra el producto."}), 404
    
    is_deleted = prsrv.delete_product(product_id)
    
    if not is_deleted:
        return jsonify({"ok": False, "message": "Hubo un problema al tratar de borrar el producto."}), 503
    
    return jsonify({"ok":True,"product:": product_id, "message": "Producto borrado correctamente."})