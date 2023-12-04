import os
from dotenv import load_dotenv

from .database import Database
from .user import User
from .product import Product
from .cart import Cart
from .cart_item import Cart_Item
from .order import Order
from .order_item import Order_Item

load_dotenv()
MYSQL_HOST = os.environ.get('MYSQL_HOST')
MYSQL_USER = os.environ.get('MYSQL_USER')
MYSQL_PASS = os.environ.get('MYSQL_PASS')
MYSQL_DB = os.environ.get('MYSQL_DB')

db = Database(
    host=MYSQL_HOST,
    user=MYSQL_USER,
    password=MYSQL_PASS,
    database=MYSQL_DB
)

userDAO = User(db)
productDAO = Product(db)
cartDAO = Cart(db)
cartItemDAO = Cart_Item(db)
orderDAO = Order(db)
orderItemDAO = Order_Item(db)