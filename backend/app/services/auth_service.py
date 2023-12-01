import os
from dotenv import dotenv_values
import bcrypt
import jwt
from datetime import datetime, timedelta
from app.models import userDAO, cartDAO

dotenv_values()

JWT_SECRET_KEY = os.environ.get('JWT_SECRET')
JWT_ALGORITHM = 'HS256'
JWT_TOKEN_EXPIRATION_TIME_MINUTES = 30

def register_user(data):
    name = data['name']
    email = data['email']
    plaintext_password = data['password']
    
    if check_mail(email):
        return False, 'Ya existe un usuario con ese email.', 401
    
    hashed_password = bcrypt.hashpw(plaintext_password.encode("utf-8"),bcrypt.gensalt()).decode("utf-8")
    
    new_user = userDAO.create(name, email, hashed_password)
    
    if new_user == None:
        return False, 'Ha ocurrido un error al tratar de registrar el usuario.', 500
    
    cartDAO.create(new_user['id'])
    
    return True, 'Usuario registrado correctamente.', 201

def check_mail(email):
    user = userDAO.fetch_by_mail(email)
    return not user == None

def check_user_id(user_id):
    return not userDAO.fetch_by_id(user_id) == None

def login_user(email, password):
    user = userDAO.fetch_by_mail(email)
    
    if user == None:
        return False, 'No hay un usuario registrado con ese email.', 404, False, False
    
    plaintext_password = password.encode("utf-8")
    hashed_password = user['password'].encode("utf-8")
    password_matches = bcrypt.checkpw(plaintext_password,hashed_password)
    
    if password_matches:
        token = generate_token(user["id"])
        res_user = {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "auth_lvl": user["auth_lvl"]
        }
        return True, 'Usuario autorizado.', 200, res_user, token
    
    return False, 'Credenciales incorrectas.', 401, False, False

def generate_token(user_id):
    expiration_time = datetime.utcnow() + timedelta(minutes=JWT_TOKEN_EXPIRATION_TIME_MINUTES)
    token_payload = {
        'user_id': user_id,
        'exp': expiration_time
    }
    token = jwt.encode(token_payload, JWT_SECRET_KEY, JWT_ALGORITHM)
    
    return token