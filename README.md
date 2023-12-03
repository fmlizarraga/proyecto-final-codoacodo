# Proyecto Final Codo a Codo

Este proyecto es la segunda parte del trabajo final para el curso Codo a Codo.

## Título

**Importienda**

## Temática

Tienda online de productos importados.

## URL de la versión navegable

- **WIP** (Work In Progress)

## Integrantes del Proyecto

- [Matias Lachitiello](https://github.com/) - DNI 43871060
- [Franco Matías Lizárraga](https://github.com/fmlizarraga) - DNI 36612616
- [Agustina Ferreira](https://github.com/) - DNI 33940157

## Información Adicional

### Back-end

- **Paquetes Utilizados**
  - Flask
  - CORS
  - jwt
  - bcrypt
  - mysql

- **Otras Tecnologías Utilizadas**
  - Postman para pruebas en rutas
  - Git para el desarrollo en equipo
  - PHP MyAdmin para comprobaciones en la base de datos

- **Rutas para Autenticación**
  - `/api/auth` [GET] (Verificar token)
  - `/api/auth` [POST] (Inicio de sesión)
    #### Formato de Petición
    ```json
    {
      "email": "test@test.com",
      "password": "123456"
    }
    ```
  - `/api/auth` [PUT] (Registro de usuario)
    #### Formato de Petición
    ```json
    {
      "name": "test",
      "email": "test@test.com",
      "password": "123456"
    }
    ```

- **Rutas para CRUD de Productos**
  - `/api/products` [POST] (Crear nuevo producto)
    #### Formato de Petición
    ```json
    {
      "title": "test",
      "description": "test@test.com",
      "price": 12.34,
      "img_url": "http://url.com/pic.jpg",
      "origin": 23
    }
    ```
  - `/api/products` [GET] (Obtener lista de productos)
  - `/api/products/{id}` [PUT] (Editar producto)
    #### Formato de Petición
    ```json
    {
      "title": "test",
      "description": "test@test.com",
      "price": 12.34,
      "img_url": "http://url.com/pic.jpg",
      "origin": 23
    }
    ```
  - `/api/products/{id}` [DELETE] (Borrar producto)

- **Rutas para Carrito y Órdenes de Compra**
  - `/api/cart` [GET] (Obtener carrito del usuario)
  - `/api/cart` [POST] (Agregar o modificar producto en el carrito del usuario)
    #### Formato de Petición
    ```json
    {
      "id": 123,
      "quantity": 2
    }
    ```
  - `/api/cart/{id}` [DELETE] (Quitar producto del carrito del usuario)
  - `/api/cart` [DELETE] (Vaciar el carrito del usuario)
  - `/api/orders` [GET] (Obtener órdenes de compra del usuario)
  - `/api/orders` [PUT] (Crear orden de compra para el usuario)
  - `/api/orders/{id}` [GET] (Obtener una orden de compra específica del usuario)

### Front-end

#### Tecnologías Utilizadas
  - Vue 3
  - Bootstrap 5
  - Animate.css 4.1
  - Font Awesome

#### Características
  - Inicio de sesión / Registro de usuarios
  - Sesión persistente incluso después de cerrar y volver a abrir el navegador
  - CRUD de productos con la autorización correspondiente
  - Gestión completa del carrito
