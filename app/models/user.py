class User:
    def __init__(self, db):
        self.db = db
        with self.db.conn.cursor() as cursor:
            cursor.execute('''CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            auth_lvl VARCHAR(255) NOT NULL DEFAULT 'client'
            )
                            ''')
    
    def create(self, name, email, password):
        sql = "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)"
        values = (name, email, password)
        with self.db.conn.cursor() as cursor:
            try:
                cursor.execute(sql, values)
                user_id = cursor.lastrowid  # Obtener el ID del usuario recién creado
                self.db.conn.commit()
                return self.fetch_by_id(user_id)  # Devolver el objeto del usuario creado
            except Exception as e:
                self.db.conn.rollback()
                print(f"Error al crear usuario: {e}")
                return None  # Devolver None en caso de error

    def fetch_by_id(self, id):
        sql = "SELECT * FROM users WHERE id = %s"
        values = (id,)
    
        with self.db.conn.cursor(dictionary=True) as cursor:
            cursor.execute(sql, values)
            return cursor.fetchone()
    
    def fetch_by_mail(self, email):
        sql = "SELECT * FROM users WHERE email = %s"
        values = (email,)

        with self.db.conn.cursor(dictionary=True) as cursor:
            cursor.execute(sql, values)
            return cursor.fetchone()
    
    def update(self, id, new_name, new_email, new_password):
        sql = "UPDATE users SET name= %s, email = %s, password = %s WHERE id = %s"
        values = (new_name, new_email, new_password, id)
        
        with self.db.conn.cursor() as cursor:
            try:
                cursor.execute(sql, values)
                self.db.conn.commit()
                if cursor.rowcount > 0:
                    return self.fetch_by_id(id)  # Devolver la versión modificada del usuario
                else:
                    return None  # Devolver None si no se realizó ninguna actualización
            except Exception as e:
                self.db.conn.rollback()
                print(f"Error en la actualización: {e}")
                return None  # Devolver None en caso de error
    
    def delete_by_id(self, id):
        sql = "DELETE FROM users WHERE id = %s"
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