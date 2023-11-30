# proyecto-final-codoacodo
Trabajo final Codo a Codo - 2da parte
## Titulo
Importienda
## Tematica
Tienda online de productos importados
## URL de la version navegable
- `WIP`
## Integrantes del proyecto
- Matias Lachitiello -  43871060
- Franco Matías Lizárraga - 36612616
- Agustina Ferreira - 33940157
## Informacion adicional
- **Back-end:**
  - `Rutas para autenticacion`
    - /api/auth [GET] (Checkear token)
    - /api/auth [POST] (Login)
      ### Formato de peticion
      ```json
      {
        "email": "test@test.com",
        "password": 123456
      }
      ```
    - /api/auth [PUT] (Registrar usuario)
      ### Formato de peticion
      ```json
      {
        "name": "test",
        "email": "test@test.com",
        "password": 123456
      }
      ```
  - `Rutas para CRUD de productos`
    - /api/products [POST] (Crear nuevo producto)
      ### Formato de peticion
      ```json
      {
        "title": "test",
        "description": "test@test.com",
        "price": 12.34,
        "img_url": "http://url.com/pic.jpg",
        "origin": 23
      }
      ```
    - /api/products [GET] (Obtener lista de productos)
    - /api/products/{id} [PUT] (Editar producto)
      ### Formato de peticion
      ```json
      {
        "title": "test",
        "description": "test@test.com",
        "price": 12.34,
        "img_url": "http://url.com/pic.jpg",
        "origin": 23
      }
      ```
    - /api/products/{id} [DELETE] (Borrar producto)
  - `Rutas para carrito y ordenes de compra`
    - /api/cart [GET] (Obtener carrito de mi usuario)
    - /api/cart [POST] (Agregar o modificar producto de carrito de mi usuario)
      ### Formato de peticion
      ```json
      {
        "id": 123,
        "quantity": 2
      }
      ```
    - /api/cart/{id} [DELETE] (Quitar producto del carrito de mi usuario)
    - /api/cart [DELETE] (Vaciar el carrito de mi usuario)
    - /api/orders [GET] (Obtener ordenes de compra de mi usuario)
    - /api/orders [PUT] (Crear orden de compra para mi usuario)
    - /api/orders/{id} [GET] (Obtener una orden de compra de mi usuario)

## Work in progress...