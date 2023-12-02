const { createApp } = Vue;

const myApp = createApp({
    components: {
        'login': loginForm,
        'products': productsList,
        'cart': cartPage
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
                cart: false
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
        async login(form) {
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
        },
        async register(form) {
            console.log("registrando...")
            const resp = await axios.put(`${this.url}/auth`,form);
            const isOk = resp.data.ok;

            console.log(resp.data.message);
            alert(resp.data.message);
            if(!isOk) {
                alert('Ocurrio un problema, por favor intenta mas tarde.')
                return;
            }

        },
        async checkToken() {
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
        async getProducts() {
            const resp = await axios.get(`${this.url}/products`,{headers:{"Authorization":`Bearer ${this.token}`}});
            const isOk = resp.data.ok;

            console.log(resp.data.message);

            if(!isOk) {
                alert('Hubo un problema al recuperar la informacion, por favor recargue la pagina.');
                this.products = [];
            }

            this.products = resp.data.products
        },
        toggleCart() {
            this.showComponents.products = !this.showComponents.products;
            this.showComponents.cart = !this.showComponents.products;
        },
        async getCart() {
            const resp = await axios.get(`${this.url}/cart`,{headers:{"Authorization":`Bearer ${this.token}`}});
            const isOk = resp.data.ok;

            console.log(resp.data.message);

            if(!isOk) {
                alert('Hubo un problema al cargar su carrito, por favor recargue la pagina.');
                this.cart = [];
            }

            this.cart = resp.data.cart;
        },
        async addToCart({itemId, quantity}) {
            const foundItem = this.cart.find(cartItem => cartItem.product.id === itemId);
            const oldQuantity = foundItem ? foundItem.quantity : 0;
            const newQuantity = oldQuantity + quantity;

            const resp = await axios.post(`${this.url}/cart`, {id: itemId, quantity: newQuantity},{headers:{"Authorization":`Bearer ${this.token}`}});
            const isOk = resp.data.ok;

            console.log(resp.data.message);

            if(!isOk) {
                alert('Hubo un problema al efectuar la operacion, por favor, intente de nuevo mas tarde.');
                return;
            }

            this.cart = resp.data.cart;
        }
    }
})

myApp.mount("#app")