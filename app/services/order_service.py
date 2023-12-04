from app.models import orderDAO, orderItemDAO, cartItemDAO, productDAO
from app.services.cart_service import check_cart, empty_cart

def populate_order_item(item):
    return {
        "product": productDAO.fetch_by_id(item['product_id']),
        "quantity": item['quantity']
    }

def populate_order(order):
    order_id = order['id']
    order_date = order['order_date']
    order_items = orderItemDAO.fetch_all_by_order(order_id)
    return {
        "order_id": order_id,
        "order_date": order_date,
        "details": [
            populate_order_item(item)
            for item in order_items
        ]
        }

def get_one_order(order_id):
    my_order = orderDAO.fetch_one_by_id(order_id)
    if my_order == None:
        return False, "No se encontro una orden con ese id.", 404, None
    order_res = populate_order(my_order)
    
    return True, "Orden recuperada correctamente.", 200, order_res

def get_orders(user_id):
    try:
        my_orders = orderDAO.fetch_all_by_user(user_id)
        # Poblar las ordenes para generar una respuesta
        order_res = [
            populate_order(order)
            for order in my_orders
        ]
    except Exception as e:
        print({e})
        return False, "Ocurrio un error al tratar de recuperar las ordenes.", 500, None
    return True, "Oredenes recuperadas correctamente", 200, order_res

def create_order(user_id):
    order_id = orderDAO.create(user_id)
    if order_id == None:
        return False, "Error interno al intentar crear la orden", 500, None
    
    # Recupero el carrito del usuario
    cart_id = check_cart(user_id)
    my_cart = cartItemDAO.fetch_all_by_cart(cart_id)
    
    # Tomo los items y cantidades del carrito para poblar la orden
    if my_cart:
        for item in my_cart:
            orderItemDAO.populate_one(order_id, item['product_id'],item['quantity'])
    else:
        print('Carrito vacio!')
    # Limpio el carro
    empty_cart(user_id)
    
    # generar un objeto para la respuesta
    # primero recupero la orden
    my_order = orderDAO.fetch_one_by_id(order_id)
    # despues poblamos los datos
    order_res = populate_order(my_order)
    
    return True, "Orden de compras creada corrrectamente.", 201, order_res