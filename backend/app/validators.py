def isValidStr(string, length):
    return isinstance(string, str) and len(string) >= length

def isNumber(value):
    try:
        float(value)
        return True
    except ValueError:
        return False

def isValidInt(value):
    return isinstance(value, int)

def isValidPrice(value):
    return isNumber(value) and float(value) >= 0

def isValidOrigin(value):
    if isNumber(value):
        return value > 0 and value < 110

def validate_new_product_data(data):
    required_fields = ['title', 'description', 'price', 'img_url', 'origin']

    # Verifica si todos los campos requeridos están presentes en los datos
    if not all(field in data for field in required_fields):
        return False

    title = data['title']
    description = data['description']
    price = data['price']
    img_url = data['img_url']
    origin = data['origin']

    # Realiza las validaciones de formato utilizando las funciones existentes
    if not isValidStr(title, 3) or not isValidStr(description, 3) or not isValidPrice(price) or not isValidStr(img_url, 3) or not isValidOrigin(origin):
        return False

    return True

def validate_existent_product_data(data, id):
    return validate_new_product_data(data) and isValidInt(id)

def validate_user_register(data):
    required_fienlds = ['name', 'email', 'password']
    
    if not all(field in data for field in required_fienlds):
        return False
    
    name = data['name']
    email = data['email']
    password = data['password']
    
    if not isValidStr(name,3) or not isValidStr(email,3) or not isValidStr(password,3):
        return False
    
    return True

def validate_login(data):
    required_fienlds = ['email', 'password']
    
    if not all(field in data for field in required_fienlds):
        return False
    
    email = data['email']
    password = data['password']
    
    if not isValidStr(email,0) or not isValidStr(password,0):
        return False
    
    return True