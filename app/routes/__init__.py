from flask import Blueprint

auth_bp = Blueprint('auth', __name__)
product_bp = Blueprint('products', __name__)
cart_bp = Blueprint('cart', __name__)
order_bp = Blueprint('order', __name__)

from . import auth_routes, product_routes, cart_routes, order_routes  # Importa las rutas después de crear el Blueprint