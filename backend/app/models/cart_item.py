class Cart_Item:
    def __init__(self, db):
        self.db = db
        with self.db.conn.cursor() as cursor:
            cursor.execute('''CREATE TABLE IF NOT EXISTS cart_items (id INT AUTO_INCREMENT PRIMARY KEY,
                    cart_id INT,
                    product_id INT,
                    quantity INT DEFAULT 1,
                    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
                    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
                )
                            ''')
    
    def update_quantity(self, cart_id, product_id, quantity):
        if quantity == 0:
            # Si la cantidad es 0, borrar el producto del carrito
            return self.delete_by_product_id(cart_id, product_id)
        
        fetched = self.fetch_by_product_id(cart_id, product_id)
        if fetched is not None:
            # Si ya encontre items, actualizo la cantidad
            
            # Compruebo que la nueva cantidad no es la misma que la anterior
            old_quantity = fetched['quantity']
            if old_quantity == quantity:
                print("La cantidad era la misma, no se realiza ningun cambio.")
                return self.fetch_all_by_cart(cart_id)
            
            sql = "UPDATE cart_items SET quantity = %s WHERE product_id = %s"
            values = (quantity, product_id)
            with self.db.conn.cursor() as cursor:
                try:
                    cursor.execute(sql, values)
                    self.db.conn.commit()
                    if cursor.rowcount > 0:
                        return self.fetch_all_by_cart(cart_id)
                    else:
                        print("No se ha realizado ningun cambio")
                        return None
                except Exception as e:
                    self.db.conn.rollback()
                    print(f"Error al actualizar item: {e}")
                    return None
        else:
            # Si no encuentro ese item en el carrito, lo creo
            sql = "INSERT INTO cart_items (product_id, cart_id, quantity) VALUES (%s, %s, %s)"
            values = (product_id, cart_id, quantity)
            with self.db.conn.cursor() as cursor:
                try:
                    cursor.execute(sql, values)
                    self.db.conn.commit()
                    return self.fetch_all_by_cart(cart_id)
                except Exception as e:
                    self.db.conn.rollback()
                    print(f"Error al crear item: {e}")
                    return None
    
    def fetch_by_product_id(self, cart_id, product_id):
        sql = "SELECT * FROM cart_items WHERE product_id = %s AND cart_id = %s"
        values = (product_id, cart_id)

        with self.db.conn.cursor(dictionary=True) as cursor:
            cursor.execute(sql, values)
            return cursor.fetchone()
    
    def fetch_all_by_cart(self, cart_id):
        sql = "SELECT * FROM cart_items WHERE cart_id = %s"
        values = (cart_id,)

        with self.db.conn.cursor(dictionary=True) as cursor:
            cursor.execute(sql, values)
            return cursor.fetchall()
    
    def delete_by_product_id(self, cart_id, product_id):
        sql = "DELETE FROM cart_items WHERE product_id = %s AND cart_id = %s"
        values = (product_id, cart_id)
        
        with self.db.conn.cursor() as cursor:
            try:
                cursor.execute(sql, values)
                self.db.conn.commit()
                if not cursor.rowcount > 0:
                    print("Nose hace nada.")
                return self.fetch_all_by_cart(cart_id)
            except Exception as e:
                self.db.conn.rollback()
                print(f"Error al eliminar uno: {e}")
                return None
    
    def delete_all_by_cart_id(self, cart_id):
        sql = "DELETE FROM cart_items WHERE cart_id = %s"
        values = (cart_id,)
        
        with self.db.conn.cursor() as cursor:
            try:
                cursor.execute(sql, values)
                self.db.conn.commit()
                if not cursor.rowcount > 0:
                    print("Nose hace nada")
                return True
            except Exception as e:
                self.db.conn.rollback()
                print(f"Error al eliminar todos: {e}")
                return False