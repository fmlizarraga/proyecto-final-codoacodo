class Product:
    def __init__(self, db):
        self.db = db
        self.db.create_origins_table()
        with self.db.conn.cursor() as cursor:
            cursor.execute('''CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                img_url VARCHAR(255),
                origin INT,
                FOREIGN KEY (origin) REFERENCES origins(id)
            )
                                ''')
    
    def create(self, title, description, price, img_url, origin ):
        sql = "INSERT INTO products (title, description, price, img_url, origin) VALUES (%s, %s, %s, %s, %s)"
        values = (title, description, price, img_url, origin)
        with self.db.conn.cursor() as cursor:
            try:
                cursor.execute(sql, values)
                product_id = cursor.lastrowid
                self.db.conn.commit()
                return self.fetch_by_id(product_id)
            except Exception as e:
                self.db.conn.rollback()
                print(f"Error al crear producto: {e}")
                return None
    
    def fetch_by_id(self, id):
        sql = "SELECT * FROM products WHERE id = %s"
        values = (id,)

        with self.db.conn.cursor(dictionary=True) as cursor:
            cursor.execute(sql, values)
            return cursor.fetchone()
    
    def fetch_all(self):
        with self.db.conn.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT * FROM products")
            products = cursor.fetchall()
            return products
    
    def update(self, id, new_title, new_description, new_price, new_img_url, new_origin):
        sql = "UPDATE products SET title= %s, description = %s, price = %s, img_url = %s, origin = %s WHERE id = %s"
        values = (new_title, new_description, new_price, new_img_url, new_origin, id)
        
        with self.db.conn.cursor() as cursor:
            try:
                cursor.execute(sql, values)
                self.db.conn.commit()
                if cursor.rowcount > 0:
                    return self.fetch_by_id(id)
                else:
                    return None
            except Exception as e:
                self.db.conn.rollback()
                print(f"Error en la actualización: {e}")
                return None
    
    def delete_by_id(self, id):
        sql = "DELETE FROM products WHERE id = %s"
        values = (id,)
        
        with self.db.conn.cursor() as cursor:
            try:
                cursor.execute(sql, values)
                self.db.conn.commit()
                return cursor.rowcount > 0
            except Exception as e:
                self.db.conn.rollback()
                print(f"Error al eliminar: {e}")
                return False