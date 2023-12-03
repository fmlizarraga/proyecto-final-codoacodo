const { createApp } = Vue;

const myApp = createApp({
    components: {
        'login': loginForm,
        'products': productsList,
        'cart': cartPage,
        'newproduct': newProductForm
    },
    data() {
        return {
            url: 'http://localhost:5000/api',
            token: '',
            user: {
                id: 0,
                name: '',
                email: '',
                auth_lvl: ''
            },
            status: 'not_logged',
            products: [],
            cart: [],
            orders: [],
            showComponents: {
                login: false,
                products: false,
                cart: false,
                newproduct: false
            },
        }
    },
    mounted() {
        this.token = localStorage.getItem('token') || '';
        if(this.token !== '') this.checkToken();
        else this.showComponents.login = true;
    },
    computed: {
        computedProducts() {
            // Devuelve los productos actualizados
            return this.products;
        },
        computedAuth() {
            return this.user.auth_lvl;
        },
        cartCount() {
            // Utiliza reduce para sumar las cantidades de todos los productos en el carrito
            return this.cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
        },
    },
    methods: {
        // Metodos basicos de UI
        toggleCart() {
            this.showComponents.products = !this.showComponents.products;
            this.showComponents.cart = !this.showComponents.products;
            this.showComponents.newproduct = false;
        },
        addproductbtn() {
            this.showComponents.newproduct = !this.showComponents.newproduct;
        },
        logOff() {
            // Borro todos los datos, retorno a un estado inicial
            this.token = '';
            this.status = 'not_logged';
            this.user = {
                id: 0,
                name: '',
                email: '',
                auth_lvl: ''
            };
            this.products = [];
            this.cart = [];
            this.showComponents.products = false;
            this.showComponents.login = true;

            localStorage.clear();
        },
        // Llamadas al Backend
        // Acciones de usuario - autorizacion
        async login(form) {
            try {
                const resp = await axios.post(`${this.url}/auth`, form);
                const isOk = resp.data.ok;

                if(!isOk) {
                    alert(resp.data.message);
                    return;
                }
                this.user = resp.data.user;
                this.token = resp.data.token;
                localStorage.setItem('token', resp.data.token);

                console.log(resp.data.message);

                this.status = 'logged';

                await this.getProducts();
                await this.getCart();

                this.showComponents.login = false
                this.showComponents.products = true
            } catch (err) {
                console.log(err);
                alert('No se pudo completar la operacion, por favor intente mas tarde.');
            }
            
        },
        async register(form) {
            try {
                const resp = await axios.put(`${this.url}/auth`,form);
                const isOk = resp.data.ok;

                console.log(resp.data.message);
                alert(resp.data.message);
                if(!isOk) {
                    alert('Ocurrio un problema, por favor intente mas tarde.')
                    return;
                }
            } catch (err) {
                console.log(err);
                alert('No se pudo completar la operacion, por favor intente mas tarde.');
            }
            
        },
        async checkToken() {
            try {
                const resp = await axios.get(`${this.url}/auth`,{headers:{"Authorization":`Bearer ${this.token}`}});
                const isOk = resp.data.ok;
    
                if(!isOk) {
                    console.log(resp.data.message);
                    alert("La sesion expiro.");
                    this.logOff();
                    return;
                }
    
                console.log(resp.data.message);
                this.token = resp.data.token;
                localStorage.setItem('token', resp.data.token);
                
                if (this.status !== 'logged') {
                    this.user = resp.data.user;
                    await this.getProducts();
                    await this.getCart();
                    this.showComponents.login = false
                    this.showComponents.products = true
                    this.status = 'logged';
                }
            } catch (err) {
                console.log(err);
                alert('Su secion expiro y se ha cerrado.')
                this.logOff();
            }
        },
        // Acciones de carrito
        async getCart() {
            try {
                const resp = await axios.get(`${this.url}/cart`,{headers:{"Authorization":`Bearer ${this.token}`}});
                const isOk = resp.data.ok;

                console.log(resp.data.message);

                if(!isOk) {
                    alert('Hubo un problema al cargar su carrito, por favor recargue la pagina.');
                    this.cart = [];
                }

                this.cart = resp.data.cart;
            } catch (err) {
                console.log(err);
                alert('Hubo un problema al recuperar la informacion, por favor intente mas tarde, se cierra la sesion.')
                this.logOff();
            }
            
        },
        async sendtocart({itemId, quantity, editing}) {
            try {
                const foundItem = this.cart.find(cartItem => cartItem.product.id === itemId);
                const oldQuantity = foundItem ? foundItem.quantity : 0;
                let newQuantity = oldQuantity + quantity;

                if(editing) newQuantity = quantity;

                const resp = await axios.post(`${this.url}/cart`, {id: itemId, quantity: newQuantity},{headers:{"Authorization":`Bearer ${this.token}`}});
                const isOk = resp.data.ok;

                console.log(resp.data.message);

                if(!isOk) {
                    alert('Hubo un problema al efectuar la operacion, por favor, intente de nuevo mas tarde.');
                    return;
                }

                this.cart = resp.data.cart;
            } catch (err) {
                console.log(err);
                alert('Hubo un problema y no se pudo completar la operacion, por favor intente mas tarde.');
            }
        },
        async removefromcart(itemId) {
            try {
                const resp = await axios.delete(`${this.url}/cart/remove/${itemId}`,{headers:{"Authorization":`Bearer ${this.token}`}});
                const isOk = resp.data.ok;

                console.log(resp.data.message);

                if(!isOk) {
                    alert('Hubo un problema al efectuar la operacion, por favor, intente de nuevo mas tarde.');
                    return;
                }

                this.cart = resp.data.cart;
            } catch (err) {
                console.log(err);
                alert('Hubo un problema y no se pudo completar la operacion, por favor intente mas tarde.');
            }
        },
        async clearcart() {
            try {
                const resp = await axios.delete(`${this.url}/cart/clear`,{headers:{"Authorization":`Bearer ${this.token}`}});
                const isOk = resp.data.ok;

                console.log(resp.data.message);

                if(!isOk) {
                    alert('Hubo un problema al efectuar la operacion, por favor, intente de nuevo mas tarde.');
                    return;
                }

                this.cart = [];
            } catch (err) {
                console.log(err);
                alert('Hubo un problema y no se pudo completar la operacion, por favor intente mas tarde.');
            }
        },
        // CRUD de productos
        async getProducts() {
            try {
                const resp = await axios.get(`${this.url}/products`,{headers:{"Authorization":`Bearer ${this.token}`}});
            const isOk = resp.data.ok;

            console.log(resp.data.message);

            if(!isOk) {
                alert('Hubo un problema al recuperar la informacion, por favor recargue la pagina.');
                this.products = [];
            }

            this.products = resp.data.products
            } catch (err) {
                console.log(err);
                alert('Hubo un problema al recuperar la informacion, por favor intente mas tarde, se cierra la sesion.')
                this.logOff();
            }
        },
        async createproduct(product) {
            console.log('crear: ', product);
            try {
                const resp = await axios.post(`${this.url}/products`, product, {headers:{"Authorization":`Bearer ${this.token}`}});
                const isOk = resp.data.ok;

                console.log(resp.data.message);

                if(!isOk) {
                    alert('Hubo un problema al efectuar la operacion, por favor, intente de nuevo mas tarde.');
                    return;
                }

                this.products = [...this.products ,resp.data.product];
            } catch (err) {
                console.log(err);
                alert('Hubo un problema y no se pudo completar la operacion, por favor intente mas tarde.');
            }
        },
        async editproduct(product) {
            try {
                const resp = await axios.put(`${this.url}/products/${product.id}`, product, {headers:{"Authorization":`Bearer ${this.token}`}});
                const isOk = resp.data.ok;

                console.log(resp.data.message);

                
                if(!isOk) {
                    alert('Hubo un problema al efectuar la operacion, por favor, intente de nuevo mas tarde.');
                    return;
                }

                const updatedProduct = resp.data.product;

                this.products = this.products.map((p) => p.id === updatedProduct.id ? updatedProduct : p);

            } catch (err) {
                console.log(err);
                alert('Hubo un problema y no se pudo completar la operacion, por favor intente mas tarde.');
            }
        },
        async deleteproduct(productId) {
            try {
                const resp = await axios.delete(`${this.url}/products/${productId}`, {headers:{"Authorization":`Bearer ${this.token}`}});
                const isOk = resp.data.ok;

                console.log(resp.data.message);

                if(!isOk) {
                    alert('Hubo un problema al efectuar la operacion, por favor, intente de nuevo mas tarde.');
                    return;
                }

                this.products = this.products.filter((p) => p.id !== productId);

            } catch (err) {
                console.log(err);
                alert('Hubo un problema y no se pudo completar la operacion, por favor intente mas tarde.');
            }
        },
        // Ordenes de compra
        async crearorden() {
            console.log("orden creada!");
        },
    }
})

myApp.mount("#app")