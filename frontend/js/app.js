const { createApp } = Vue;

const myApp = createApp({
    components: {
        'login': loginForm,
        'products': productsList
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
            },
        }
    },
    mounted() {
        this.showComponents.login = true
        this.token = localStorage.getItem('token');
    },
    computed: {
        computedProducts() {
            // Devuelve los productos actualizados
            return this.products;
        },
        computedAuth() {
            return this.user.auth_lvl;
        }
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

            this.token = resp.data.token;
            localStorage.setItem('token', resp.data.token);
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
            this.showComponents.products = false;
            this.showComponents.login = true;

            localStorage.clear();
        },
        async getProducts() {
            const resp = await axios.get(`${this.url}/products`,{headers:{"Authorization":`Bearer ${this.token}`}});
            const isOk = resp.data.ok;

            console.log(resp.data.message);

            if(!isOk) {
                alert('Hubo un problema al procesar la solicitud, por favor recargue la pagina.');
                this.products = [];
            }

            this.products = resp.data.products
        }
    }
})

myApp.mount("#app")