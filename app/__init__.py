from flask import Flask, request
from flask_cors import CORS
from app.routes import auth_bp, product_bp, cart_bp, order_bp

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)

@app.before_request
def before_request():
    print(request.endpoint)
    print('Antes de la request!')

app.register_blueprint(auth_bp)
app.register_blueprint(product_bp)
app.register_blueprint(cart_bp)
app.register_blueprint(order_bp)

from app.routes.auth_routes import *
from app.routes.product_routes import *
from app.routes.cart_routes import *
from app.routes.order_routes import *
