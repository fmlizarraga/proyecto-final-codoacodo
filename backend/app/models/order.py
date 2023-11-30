class Order:
    def __init__(self, db):
        self.db = db
        with self.db.conn.cursor() as cursor:
            cursor.execute('''CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(255) NOT NULL DEFAULT 'pending',
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
                            ''')
    
    def create(self, user_id):
        sql = "INSERT INTO orders (user_id) VALUES (%s)"
        values = (user_id,)
        with self.db.conn.cursor() as cursor:
            try:
                cursor.execute(sql, values)
                order_id = cursor.lastrowid
                self.db.conn.commit()
                return order_id
            except Exception as e:
                self.db.conn.rollback()
                print(f"Error al crear orden: {e}")
                return None
    
    def fetch_all_by_user(self, user_id):
        sql = "SELECT * FROM orders WHERE user_id = %s"
        values = (user_id,)
        
        with self.db.conn.cursor(dictionary=True) as cursor:
            cursor.execute(sql, values)
            return cursor.fetchall()
    
    def fetch_one_by_id(self, order_id):
        sql = "SELECT * FROM orders WHERE id = %s"
        values = (order_id,)

        with self.db.conn.cursor(dictionary=True) as cursor:
            cursor.execute(sql, values)
            return cursor.fetchone()
    
    def delete_by_id(self, order_id):
        sql = "DELETE FROM orders WHERE id = %s"
        values = (order_id,)
        
        with self.db.conn.cursor() as cursor:
            try:
                cursor.execute(sql, values)
                self.db.conn.commit()
                return cursor.rowcount > 0
            except Exception as e:
                self.db.conn.rollback()
                print(f"Error al eliminar: {e}")
                return False