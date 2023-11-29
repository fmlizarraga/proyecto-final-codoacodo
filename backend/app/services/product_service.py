from app.models import productDAO

def fetch_products():
    fetched_products = productDAO.fetch_all()
    
    for product in fetched_products:
        product['price'] = float(product['price'])
    
    return fetched_products

def create_product(data):
    
    title = data['title']
    description = data['description']
    price = data['price']
    img_url = data['img_url']
    origin = data['origin']
    
    new_product = productDAO.create(title,description,price,img_url,origin)
    
    if not new_product == None:
        new_product['price'] = float(new_product['price'])
    
    return new_product

def update_product(data, product_id):
    
    title = data['title']
    description = data['description']
    price = data['price']
    img_url = data['img_url']
    origin = data['origin']
    
    updated_product = productDAO.update(product_id,title,description,price,img_url,origin)
    
    if not updated_product == None:
        updated_product['price'] = float(updated_product['price'])
    
    return updated_product

def delete_product(product_id):
    return productDAO.delete_by_id(product_id)

def find_product(product_id):
    product = productDAO.fetch_by_id(product_id)
    
    return not product == None