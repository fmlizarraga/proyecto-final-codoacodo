class Order_Item:
    def __init__(self, db):
        self.db = db
        with self.db.conn.cursor() as cursor:
            cursor.execute('''CREATE TABLE IF NOT EXISTS order_items (id INT AUTO_INCREMENT PRIMARY KEY,
                    order_id INT,
                    product_id INT,
                    quantity INT,
                    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
                )
                            ''')
    
    def populate_one(self, order_id, product_id, quantity):
        sql = "INSERT INTO order_items (order_id, product_id, quantity) VALUES (%s, %s, %s)"
        values = (order_id, product_id, quantity)
        with self.db.conn.cursor() as cursor:
            try:
                cursor.execute(sql, values)
                self.db.conn.commit()
                return True
            except Exception as e:
                self.db.conn.rollback()
                print(f"Error al crear producto: {e}")
                return False
    
    def fetch_by_product_id(self, order_id, product_id):
        sql = "SELECT * FROM order_items WHERE product_id = %s AND order_id = %s"
        values = (product_id, order_id)

        with self.db.conn.cursor(dictionary=True) as cursor:
            cursor.execute(sql, values)
            return cursor.fetchone()
    
    def fetch_all_by_order(self, order_id):
        sql = "SELECT * FROM order_items WHERE order_id = %s"
        values = (order_id,)

        with self.db.conn.cursor(dictionary=True) as cursor:
            cursor.execute(sql, values)
            return cursor.fetchall()