import os
import jwt
from functools import wraps
from flask import Flask, request, abort, jsonify
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from dotenv import dotenv_values
# from app.services import auth_service as auth
from app.models import userDAO

dotenv_values()

JWT_SECRET_KEY = os.environ.get('JWT_SECRET')

app = Flask(__name__)

# Decorador personalizado para verificar la autorización
def requires_authorization(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        # Recuperar el valor del encabezado "Authorization"
        authorization_header = request.headers.get('Authorization')

        # Verificar si el encabezado está presente y tiene el formato correcto
        if authorization_header and authorization_header.startswith('Bearer '):
            
            token = authorization_header.split(' ')[1]
            
            # Si la autenticación falla, abortar la solicitud
            # con un código de estado 401 (No autorizado)
            if not verify_auth(token):
                response = jsonify({"ok": False, "message": "No autorizado"})
                response.status_code = 401
                return response
            
            # Si la autenticación es exitosa, se pasa a ejecutar la función de ruta
            return func(*args, **kwargs)

        # Si el encabezado no está presente o no tiene el formato correcto,
        # abortar la solicitud con un código de estado 401
        response = jsonify({"ok": False, "message": "No autorizado"})
        response.status_code = 401
        return response

    return wrapper

# Función para verificar la autenticación
def verify_auth(token):
    try:
        # Decodificar el token
        decoded_token = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        user_id = decoded_token['user_id']
        # auth_lvl = decoded_token["auth_lvl"]
        
        # Verificar la validez del token
        # Consultar la base de datos para verificar la existencia del usuario
        # Si el usuario exixte, se inyecta los datos del usuario en el objeto peticion y se devuelve True
        # if auth.check_user_id(user_id):
        #     request.user_id = user_id
        #     request.auth_lvl = auth_lvl
        #     return True
        user = userDAO.fetch_by_id(user_id)
        if not user == None:
            request.user_id = user_id
            request.auth_lvl = user['auth_lvl']
            return True
        
        # Si no, se devuelve False
        return False
    except ExpiredSignatureError:
        # El token ha expirado
        print("Token expirado")
        return False
    except InvalidTokenError:
        # El token no es válido
        print("Token no válido")
        return False