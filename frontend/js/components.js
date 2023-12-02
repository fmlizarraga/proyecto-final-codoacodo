const loginForm = {
    template: `
    <div class="container mt-5">
        <div class="card form-container">
            <div class="card-body">
                <form @submit.prevent="submitLoginForm" class="needs-validation">

                    <div v-if="showRegister" class="mb-3">
                        <label for="name" class="form-label">Nombre:</label>
                        <input type="text" id="name" v-model="form_name" class="form-control" required>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Email:</label>
                        <input type="email" id="email" v-model="form_email" class="form-control" required>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Contraseña:</label>
                        <input type="password" id="password" v-model="form_password" class="form-control" required>
                    </div>

                    <button type="submit" class="btn btn-primary">{{ submitBtnTxt }}</button>
                </form>
                <div class="mt-3">
                    <span v-if="!showRegister" class="d-block text-center">
                        Aún no tienes cuenta? <a href="#" @click="toggleRegister">Regístrate</a>
                    </span>
                    <span v-if="showRegister" class="d-block text-center">
                        Ya tienes cuenta? <a href="#" @click="toggleRegister">Ingresa</a>
                    </span>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            showRegister: false,
            submitBtnTxt: 'Iniciar sesión',
            form_name: '',
            form_email: '',
            form_password: '',
    };
    },
    methods: {
        submitLoginForm() {
            // Llamo a la accion que corresponda
            if(this.showRegister) this.$emit('register', { name: this.form_name, email: this.form_email, password: this.form_password });
            else this.$emit('login', { email: this.form_email, password: this.form_password });

            // Limpio los campos y vuelvo al estado inicial
            this.showRegister = false;
            this.submitBtnTxt = 'Iniciar sesión';
            this.form_name = '';
            this.form_email = '';
            this.form_password = '';
        },
        toggleRegister() {
            this.showRegister = !this.showRegister;
            this.submitBtnTxt = this.showRegister ? 'Registrarme' : 'Iniciar sesión';
        }
    }
}

const cartPage = {
    template: `
    <div>
        <h2>
            Carrito de compras
        </h2>
        <ul>
            <li v-for="(cartItem, index) in cart" :key="index">
                <img :src="cartItem.product.img_url" alt="Product Image">
                <div>
                    <h4>{{ cartItem.product.title }}</h4>
                    <p>{{ cartItem.product.description }}</p>
                    <p>Quantity: {{ cartItem.quantity }}</p>
                    <p>Price: $ {{ cartItem.product.price }}</p>
                </div>
            </li>
        </ul>
    </div>
    `,
    props: ['cart'],
    data() {
        return {

        }
    },
    methods: {
        
    }
}

const productItem = {
    template: `
    <div class="card" style="width: 18rem;">
        <img :src="product.img_url" class="card-img-top" :alt="product.title">
        <div class="card-body">
            <h5 class="card-title">{{ product.title }}</h5>
            <p class="card-text">{{ product.description }}</p>
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item">Precio: $ {{ product.price }}</li>
            <li class="list-group-item">Origen: {{ getCountryName(product.origin) }}</li>
        </ul>
        <div class="card-body d-flex justify-content-between">
            <button @click="onCartBtn" class="btn btn-success">
                <i class="fa-solid fa-cart-plus"></i>
                Agregar
            </button>
            <button @click="onAdminBtn" v-if="auth_lvl === 'admin'" class="btn btn-info">
                <i class="fa-solid fa-wrench"></i>
                Administrar
            </button>
        </div>
    </div>
    `,
    props: ['product', 'auth_lvl', 'url'],
    methods: {
        onCartBtn() {
            console.log(this.url);
            console.log(this.token)
            console.log("Carrito!");
            // TODO emitir a addTocart, agregar data para enviar...
        },
        onAdminBtn() {
            console.log("Administrar!")
        },
        async addToCart() {},
        getCountryName(origin) {
            // Mapear el número de origen al país correspondiente
            const countries = {
                1: 'Afganistán',
                2: 'Argelia',
                3: 'Samoa Americana',
                4: 'Angola',
                5: 'Anguila',
                6: 'Argentina',
                7: 'Armenia',
                8: 'Australia',
                9: 'Austria',
                10: 'Azerbaiyán',
                11: 'Baréin',
                12: 'Bangladés',
                13: 'Bielorrusia',
                14: 'Bolivia',
                15: 'Brasil',
                16: 'Brunéi',
                17: 'Bulgaria',
                18: 'Camboya',
                19: 'Camerún',
                20: 'Canadá',
                21: 'Chad',
                22: 'Chile',
                23: 'China',
                24: 'Colombia',
                25: 'República Democrática del Congo',
                26: 'República Checa',
                27: 'República Dominicana',
                28: 'Ecuador',
                29: 'Egipto',
                30: 'Estonia',
                31: 'Etiopía',
                32: 'Islas Feroe',
                33: 'Finlandia',
                34: 'Francia',
                35: 'Guayana Francesa',
                36: 'Polinesia Francesa',
                37: 'Gambia',
                38: 'Alemania',
                39: 'Grecia',
                40: 'Groenlandia',
                41: 'Ciudad del Vaticano',
                42: 'Hong Kong',
                43: 'Hungría',
                44: 'India',
                45: 'Indonesia',
                46: 'Irán',
                47: 'Irak',
                48: 'Israel',
                49: 'Italia',
                50: 'Japón',
                51: 'Kazajistán',
                52: 'Kenia',
                53: 'Kuwait',
                54: 'Letonia',
                55: 'Liechtenstein',
                56: 'Lituania',
                57: 'Madagascar',
                58: 'Malaui',
                59: 'Malasia',
                60: 'México',
                61: 'Moldavia',
                62: 'Marruecos',
                63: 'Mozambique',
                64: 'Birmania',
                65: 'Nauru',
                66: 'Nepal',
                67: 'Países Bajos',
                68: 'Nueva Zelanda',
                69: 'Nigeria',
                70: 'Corea del Norte',
                71: 'Omán',
                72: 'Pakistán',
                73: 'Paraguay',
                74: 'Perú',
                75: 'Filipinas',
                76: 'Polonia',
                77: 'Puerto Rico',
                78: 'Rumanía',
                79: 'Reunión',
                80: 'Federación de Rusia',
                81: 'San Vicente y las Granadinas',
                82: 'Arabia Saudita',
                83: 'Senegal',
                84: 'Eslovaquia',
                85: 'Sudáfrica',
                86: 'Corea del Sur',
                87: 'España',
                88: 'Sri Lanka',
                89: 'Sudán',
                90: 'Suecia',
                91: 'Suiza',
                92: 'Taiwán',
                93: 'Tanzania',
                94: 'Tailandia',
                95: 'Tonga',
                96: 'Túnez',
                97: 'Turquía',
                98: 'Turkmenistán',
                99: 'Tuvalu',
                100: 'Ucrania',
                101: 'Emiratos Árabes Unidos',
                102: 'Reino Unido',
                103: 'Estados Unidos',
                104: 'Venezuela',
                105: 'Vietnam',
                106: 'Islas Vírgenes de los Estados Unidos',
                107: 'Yemen',
                108: 'Yugoslavia',
                109: 'Zambia'
            };

            return countries[origin] || 'Desconocido';
        }
    },
    data() {
        return {
            token: ''
        }
    },
    mounted() {
        this.token = localStorage.getItem('token');
    }
}

const productsList = {
    template: `
    <div class="container mt-5">
        <h2 class="mb-4">Productos</h2>
        <div class="row">
            <div v-for="product in products" :key="product.id" class="col-md-4">
                <div class="mb-4">
                    <product :product="product" :auth_lvl="auth_lvl" :url="url"></product>
                </div>
            </div>
        </div>
    </div>
    `,
    components: {
        'product': productItem
    },
    props: ['products', 'auth_lvl', 'url'],
    data() {
        return {
        };
    },
    methods: {},
}
