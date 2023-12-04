class Cart:
    def __init__(self, db):
        self.db = db
        with self.db.conn.cursor() as cursor:
            cursor.execute('''CREATE TABLE IF NOT EXISTS carts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
                            ''')
    
    def create(self, user_id):
        sql = "INSERT INTO carts (user_id) VALUES (%s)"
        values = (user_id,)
        with self.db.conn.cursor() as cursor:
            try:
                cursor.execute(sql, values)
                cart_id = cursor.lastrowid
                self.db.conn.commit()
                return cart_id
            except Exception as e:
                self.db.conn.rollback()
                print(f"Error al crear carrito: {e}")
                return None
    
    def fetch_by_user(self, user_id):
        sql = "SELECT * FROM carts WHERE user_id = %s"
        values = (user_id,)
        
        with self.db.conn.cursor(dictionary=True) as cursor:
            cursor.execute(sql, values)
            return cursor.fetchone()
    
    def delete_by_user(self, user_id):
        sql = "DELETE FROM carts WHERE user_id = %s"
        values = (user_id,)
        
        with self.db.conn.cursor() as cursor:
            try:
                cursor.execute(sql, values)
                self.db.conn.commit()
                return cursor.rowcount > 0
            except Exception as e:
                self.db.conn.rollback()
                print(f"Error al eliminar: {e}")
                return False