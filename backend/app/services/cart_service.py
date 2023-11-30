from app.models import cartDAO, cartItemDAO
from app.models import productDAO

def check_cart(user_id):
    my_cart = cartDAO.fetch_by_user(user_id)
    if my_cart == None:
        # Si por algun motivo el usuario no tiene un carrito, crear uno
        my_cart = cartDAO.create(user_id)
    if my_cart == None:
        # Volver a verificar y si aun no tiene, se devuelve un error
        return False
    
    return my_cart['id']

def format_cart_for_response(my_cart):
    return [
        {
            "product": productDAO.fetch_by_id(item["product_id"]),
            "quantity": item["quantity"]
        }
        for item in my_cart
    ]

def get_my_cart(user_id):
    # Verificar si tiene carrito o devolver un error
    my_cart_id = check_cart(user_id)
    if not my_cart_id:
        return False, "No se pudo completar la accion.", 500, None
    
    my_cart = cartItemDAO.fetch_all_by_cart(my_cart_id)
    cart_response = format_cart_for_response(my_cart)
    return True, "Carrito de usuario recuperado con exito.", 200, cart_response

def add_or_remove_from_cart(user_id, product_id, quantity):
    # Me aseguro de que el usuario tiene un carrito
    my_cart_id = check_cart(user_id)
    if not my_cart_id:
        return False, "No se pudo completar la accion.", 500, None
    
    # Ese producto, existe?
    my_product = productDAO.fetch_by_id(product_id)
    if my_product == None:
        old_cart = format_cart_for_response(cartItemDAO.fetch_all_by_cart(my_cart_id))
        return True, "Producto no encontrado.", 404, old_cart
    
    # Actualizo la cantidad de ese item en el carrito
    my_cart = cartItemDAO.update_quantity(my_cart_id, product_id, quantity)
    
    if my_cart == None:
        return False, "No se pudo completar la accion.", 500, None
    
    cart_response = format_cart_for_response(my_cart)
    
    return True, "Carrito actualizado correctamente.", 200, cart_response

def delete_from_cart(user_id, product_id):
    my_cart_id = check_cart(user_id)
    if not my_cart_id:
        return False, "No se pudo completar la accion.", 500, None
    
    my_cart = cartItemDAO.delete_by_product_id(my_cart_id,product_id)
    if my_cart == None:
        return False, "No se pudo completar la accion.", 500, None
    cart_response = format_cart_for_response(my_cart)
    
    return True, "Producto removido correctamente del carrito.", 200, cart_response

def empty_cart(user_id):
    my_cart_id = check_cart(user_id)
    is_empty = cartItemDAO.delete_all_by_cart_id(my_cart_id)
    if not is_empty:
        return False, "No se pudo completar la accion.", 500
    return True, "Carrito vaciado correctamente.", 200