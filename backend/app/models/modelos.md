### Tabla de Usuarios (`users`):
- **Campos:**
  - `id` (Clave primaria)
  - `name`
  - `email`
  - `auth_lvl` (user | admin - default: user)
  - `password` (se almacenan hashes en lugar de contraseñas en texto plano)

### Tabla de Productos (`products`):
- **Campos:**
  - `id` (Clave primaria)
  - `title`
  - `description`
  - `price`
  - `imgurl`

### Tabla de Carrito de Compras (`carts`):
- **Campos:**
  - `id` (clave primaria)
  - `user_id` (clave foránea a `users`)
  - `created_at` (fecha de creación, opcional)

### Tabla de Ítems de Carrito (`cart_items`):
- **Campos:**
  - `id` (clave primaria)
  - `cart_id` (clave foránea a `cart`)
  - `product_id` (clave foránea a `products`)
  - `quantity`

### Tabla de Pedidos (`orders`):
- **Campos:**
  - `id` (Clave primaria)
  - `user_id` (Clave foránea a `users`)
  - `order_date`
  - `status` (puede ser 'pendiente', 'completado', etc.)

### Tabla de Detalles del Pedido (`order_details`):
- **Campos:**
  - `order_id` (Clave foránea a `orders`)
  - `product_id` (Clave foránea a `products`)
  - `quantity`

Con este esquema:

- La tabla `users` almacena información sobre los usuarios.
- La tabla `products` almacena información sobre los productos disponibles.
- La tabla `carts` almacena el carrito de cada usuario.
- La tabla `cart_items` almacena los productos de cada carrito.
- La tabla `orders` almacena información general sobre cada pedido.
- La tabla `order_details` almacena los detalles específicos de los productos en cada pedido.
