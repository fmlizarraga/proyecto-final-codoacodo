const loginForm = {
    template: `
    <div class="container login">
        <div class="card form-container mx-auto col-md-6">
            <div class="card-body">
                <form @submit.prevent="submitLoginForm" class="needs-validation d-flex flex-column">

                    <div v-if="showRegister" class="mb-3 d-flex flex-row align-items-center">
                        <label for="name" class="form-label mx-1"><i class="fa-solid fa-user"></i></label>
                        <input type="text" id="name" v-model="form_name" class="form-control" placeholder="Tu nombre" required>
                    </div>

                    <div class="mb-3 d-flex flex-row align-items-center">
                        <label for="email" class="form-label mx-1"><i class="fa-solid fa-envelope"></i></label>
                        <input type="email" id="email" v-model="form_email" class="form-control" placeholder="Tu E-mail" required>
                    </div>

                    <div class="mb-3 d-flex flex-row align-items-center">
                        <label for="password" class="form-label mx-1"><i class="fa-solid fa-lock"></i></label>
                        <input type="password" id="password" v-model="form_password" class="form-control" placeholder="Contraseña" required>
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

const orderPage = {
    template: `
    <div class="container mt-4">
        <h2 class="mb-4">Detalles del Pedido</h2>
        <div class="mb-4">
        <p class="fw-bold">ID de Pedido: {{ order.order_id }}</p>
        <p class="fw-bold">Fecha del Pedido: {{ formatDate(order.order_date) }}</p>
        </div>
            <div v-for="(detail, index) in order.details" :key="index" class="mb-4">
            <h3 class="mb-3">Detalle {{ index + 1 }}</h3>
            <div class="row">
                <div class="col-md-3">
                <img :src="detail.product.img_url" alt="Product Image" class="img-fluid" style="max-width: 100px; max-height: 100px;">
                </div>
                <div class="col-md-9">
                <p class="fw-bold">Descripción: {{ detail.product.description }}</p>
                <p class="fw-bold">Precio: $ {{ parseFloat(detail.product.price).toFixed(2) }}</p>
                <p class="fw-bold">Cantidad: {{ detail.quantity }}</p>
                </div>
            </div>
        </div>
        <button class="btn btn-primary" @click="acceptOrder">Aceptar</button>
    </div>
    `,
    props: ['order'],
    methods: {
        formatDate(dateString) {
            const formattedDate = new Date(dateString).toISOString()
            return formattedDate;
        },
        acceptOrder() {
            this.$emit('toggleorder');
        }
    }
}

const cartPage = {
    template: `
    <div class="container animate__animated animate__fadeInRight">
    <h2 class="mt-4 mb-4">Carrito de compras</h2>
    <ul class="list-group">
        <li v-for="(cartItem, index) in cart" :key="index" class="list-group-item">
            <div class="row">
            <div class="col-md-3">
                <img :src="cartItem.product.img_url" alt="Product Image" class="img-fluid">
            </div>
            <div class="col-md-9">
                <h4>{{ cartItem.product.title }}</h4>
                <p>{{ cartItem.product.description }}</p>

                <button v-if="!showSetQuantity || cartItem.product.id !== selected"  
                    class="btn btn-outline-dark" 
                    @click="() => toggleOnSetQuantity(cartItem.product.id, cartItem.quantity)" >
                    Cantidad: {{ cartItem.quantity }}
                </button>
                
                <div v-if="showSetQuantity && cartItem.product.id === selected" class="form-inline d-flex align-items-center mt-2">
                    <div class="form-group mb-2 flex-grow-0">
                        <label for="inputQuantity" class="sr-only">Cantidad</label>
                        <input type="number" class="form-control border border-primary" id="inputQuantity" v-model="formQuantity" style="max-width: 100px;">
                    </div>
                    <button class="btn btn-primary btn-sm mb-2 mx-2 flex-grow-0" @click="onSetItemQuantity" >Aceptar</button>
                    <button class="btn btn-secondary btn-sm mb-2 mx-2 flex-grow-0" @click="toggleOffSetQuantity">Cancelar</button>
                </div>
                
                <p class="mt-2 mx-2" >Precio: $ {{ cartItem.product.price }}</p>
                <button v-if="!showRemoveQ || cartItem.product.id !== selected" @click="() => toggleOnRemoveQ(cartItem.product.id)" class="btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-trash"></i>
                    Quitar
                </button>
                <div v-if="showRemoveQ && cartItem.product.id === selected" class="mt-2">
                    <div class="alert alert-warning mt-2 py-1" role="alert">
                        Estas seguro?
                    </div>
                    <button @click="onRemoveItem" class="btn btn-danger btn-sm mr-2">
                        <i class="fa-solid fa-trash"></i>
                        Si
                    </button>
                    <button @click="toggleOffRemoveQ" class="btn btn-secondary btn-sm mx-2">
                        Cancelar
                    </button>
                </div>
            </div>
            </div>
        </li>
        </ul>
        <div v-if="cart.length !== 0" class="mt-4">
            <h4>Total: $ {{ calcularTotal() }}</h4>

            <div v-if="!showClearQ" class="d-flex justify-content-between mt-4">
                <button class="btn btn-success" @click="realizarOrden">
                <i class="fas fa-check"></i> Realizar Orden
                </button>
                <button class="btn btn-danger ml-2" @click="limpiarCarrito">
                <i class="fas fa-trash-alt"></i> Limpiar Carrito
                </button>
            </div>

            <div v-if="showClearQ" class="mt-2">
                <div class="alert alert-warning mt-2 py-1" role="alert">
                    Estas seguro?
                </div>
                <button @click="onClearCart" class="btn btn-danger btn-sm mr-2">
                    <i class="fa-solid fa-trash"></i>
                    Si
                </button>
                <button @click="limpiarCarrito" class="btn btn-secondary btn-sm mx-2">
                    Cancelar
                </button>
            </div>
        </div>
        <div v-if="cart.length === 0" class="mt-4 text-center">
            <i class="fas fa-shopping-cart fa-5x mb-3"></i>
            <h4>Tu carrito está vacío, ¡agrega algunos productos!</h4>
        </div>
    </div>
    `,
    props: ['cart'],
    data() {
        return {
            showRemoveQ: false,
            showClearQ: false,
            showSetQuantity: false,
            selected: -1,
            formQuantity: 1
        }
    },
    methods: {
        calcularTotal() {
            // Lógica para calcular el total del carrito
            return this.cart.reduce((total, item) => total + item.quantity * item.product.price, 0).toFixed(2);
        },
        realizarOrden() {
        alert('Orden realizada!');
        this.onOrder();
        },
        limpiarCarrito() {
        this.showClearQ = !this.showClearQ;
        },
        toggleOnRemoveQ(id) {
            this.selected = id;
            this.showRemoveQ = true;
            this.showSetQuantity = false;
        },
        toggleOffRemoveQ() {
            this.selected = -1;
            this.showRemoveQ = false
        },
        toggleOnSetQuantity(id,quantity) {
            this.selected = id;
            this.formQuantity = quantity;
            this.showRemoveQ = false;
            this.showSetQuantity = true;
        },
        toggleOffSetQuantity() {
            this.selected = -1;
            this.formQuantity = 1;
            this.showSetQuantity = false;
        },
        onRemoveItem() {
            this.$emit('removefromcart', this.selected);
            this.toggleOffRemoveQ();
        },
        onSetItemQuantity() {
            this.$emit('sendtocart',{itemId: this.selected, quantity: this.formQuantity, editing: true});
            this.toggleOffSetQuantity();
        },
        onClearCart() {
            this.$emit('clearcart');
            this.limpiarCarrito();
        },
        onOrder() {
            this.$emit('crearorden');
        },
    }
}

const newProductForm = {
    template: `
    <div class="container bottom-border add-product-form animate__animated animate__backInDown">
        <div class="row mt-4">
            <div class="col-12 col-sm-6">
                <label for="formImgUrl" class="form-label">URL de la Imagen</label>
                <input id="formImgUrl" class="form-control form-control-sm" v-model="formImgUrl" @input="updatePreview" type="text">
                <div class="mt-3">
                    <img :src="imgPreview" id="preview" class="img-thumbnail img-preview" alt="Vista Previa">
                </div>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="newtitle" class="form-label">Titulo</label>
                    <input id="newtitle" v-model="formTitle" class="form-control" @input="updateValidation" type="text">
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label for="newdescription" class="form-label">Descripción</label>
                    <input id="newdescription" v-model="formDescription" class="form-control" @input="updateValidation" type="text">
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="newprice" class="form-label">Precio</label>
                    <input id="newprice" v-model="formPrice" class="form-control" @input="updateValidation" type="number">
                </div>
            </div>

            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="neworigin" class="form-label">Origen</label>

                    <select id="origin" v-model="formOrigin" class="form-select" required>
                        <option value="" disabled>Selecciona un país</option>
                        <option v-for="(country, index) in countries" :key="index" :value="country.id">
                            {{ country.name }}
                        </option>
                    </select>

                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-6">
                <button class="btn btn-success mt-4" @click="onCreateProductBtn" :disabled="!isValidForm">Crear</button>
            </div>
            <div class="col-6">
                <button class="btn btn-secondary mt-4" @click="onCancelCreateBtn">Cancelar</button>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            isValidForm: false,
            formTitle: '',
            formDescription: '',
            formImgUrl: '',
            imgPreview: './resources/default-img.png',
            formPrice: 0,
            formOrigin: 1,
            countries: [
                {id: 1, name: 'Afganistán'},
                {id: 2, name: 'Argelia'},
                {id: 3, name: 'Samoa Americana'},
                {id: 4, name: 'Angola'},
                {id: 5, name: 'Anguila'},
                {id: 6, name: 'Argentina'},
                {id: 7, name: 'Armenia'},
                {id: 8, name: 'Australia'},
                {id: 9, name: 'Austria'},
                {id: 10, name: 'Azerbaiyán'},
                {id: 11, name: 'Baréin'},
                {id: 12, name: 'Bangladés'},
                {id: 13, name: 'Bielorrusia'},
                {id: 14, name: 'Bolivia'},
                {id: 15, name: 'Brasil'},
                {id: 16, name: 'Brunéi'},
                {id: 17, name: 'Bulgaria'},
                {id: 18, name: 'Camboya'},
                {id: 19, name: 'Camerún'},
                {id: 20, name: 'Canadá'},
                {id: 21, name: 'Chad'},
                {id: 22, name: 'Chile'},
                {id: 23, name: 'China'},
                {id: 24, name: 'Colombia'},
                {id: 25, name: 'República Democrática del Congo'},
                {id: 26, name: 'República Checa'},
                {id: 27, name: 'República Dominicana'},
                {id: 28, name: 'Ecuador'},
                {id: 29, name: 'Egipto'},
                {id: 30, name: 'Estonia'},
                {id: 31, name: 'Etiopía'},
                {id: 32, name: 'Islas Feroe'},
                {id: 33, name: 'Finlandia'},
                {id: 34, name: 'Francia'},
                {id: 35, name: 'Guayana Francesa'},
                {id: 36, name: 'Polinesia Francesa'},
                {id: 37, name: 'Gambia'},
                {id: 38, name: 'Alemania'},
                {id: 39, name: 'Grecia'},
                {id: 40, name: 'Groenlandia'},
                {id: 41, name: 'Ciudad del Vaticano'},
                {id: 42, name: 'Hong Kong'},
                {id: 43, name: 'Hungría'},
                {id: 44, name: 'India'},
                {id: 45, name: 'Indonesia'},
                {id: 46, name: 'Irán'},
                {id: 47, name: 'Irak'},
                {id: 48, name: 'Israel'},
                {id: 49, name: 'Italia'},
                {id: 50, name: 'Japón'},
                {id: 51, name: 'Kazajistán'},
                {id: 52, name: 'Kenia'},
                {id: 53, name: 'Kuwait'},
                {id: 54, name: 'Letonia'},
                {id: 55, name: 'Liechtenstein'},
                {id: 56, name: 'Lituania'},
                {id: 57, name: 'Madagascar'},
                {id: 58, name: 'Malaui'},
                {id: 59, name: 'Malasia'},
                {id: 60, name: 'México'},
                {id: 61, name: 'Moldavia'},
                {id: 62, name: 'Marruecos'},
                {id: 63, name: 'Mozambique'},
                {id: 64, name: 'Birmania'},
                {id: 65, name: 'Nauru'},
                {id: 66, name: 'Nepal'},
                {id: 67, name: 'Países Bajos'},
                {id: 68, name: 'Nueva Zelanda'},
                {id: 69, name: 'Nigeria'},
                {id: 70, name: 'Corea del Norte'},
                {id: 71, name: 'Omán'},
                {id: 72, name: 'Pakistán'},
                {id: 73, name: 'Paraguay'},
                {id: 74, name: 'Perú'},
                {id: 75, name: 'Filipinas'},
                {id: 76, name: 'Polonia'},
                {id: 77, name: 'Puerto Rico'},
                {id: 78, name: 'Rumanía'},
                {id: 79, name: 'Reunión'},
                {id: 80, name: 'Federación de Rusia'},
                {id: 81, name: 'San Vicente y las Granadinas'},
                {id: 82, name: 'Arabia Saudita'},
                {id: 83, name: 'Senegal'},
                {id: 84, name: 'Eslovaquia'},
                {id: 85, name: 'Sudáfrica'},
                {id: 86, name: 'Corea del Sur'},
                {id: 87, name: 'España'},
                {id: 88, name: 'Sri Lanka'},
                {id: 89, name: 'Sudán'},
                {id: 90, name: 'Suecia'},
                {id: 91, name: 'Suiza'},
                {id: 92, name: 'Taiwán'},
                {id: 93, name: 'Tanzania'},
                {id: 94, name: 'Tailandia'},
                {id: 95, name: 'Tonga'},
                {id: 96, name: 'Túnez'},
                {id: 97, name: 'Turquía'},
                {id: 98, name: 'Turkmenistán'},
                {id: 99, name: 'Tuvalu'},
                {id: 100, name: 'Ucrania'},
                {id: 101, name: 'Emiratos Árabes Unidos'},
                {id: 102, name: 'Reino Unido'},
                {id: 103, name: 'Estados Unidos'},
                {id: 104, name: 'Venezuela'},
                {id: 105, name: 'Vietnam'},
                {id: 106, name: 'Islas Vírgenes de los Estados Unidos'},
                {id: 107, name: 'Yemen'},
                {id: 108, name: 'Yugoslavia'},
                {id: 109, name: 'Zambia'}
            ]
        }
    },
    methods: {
        updatePreview() {
            this.imgPreview = this.formImgUrl;
            if(this.formImgUrl === '') this.imgPreview = './resources/default-img.png';
            this.isValidForm = this.validateForm();
        },
        updateValidation() {
            this.isValidForm = this.validateForm();
        },
        onCreateProductBtn() {
            this.$emit('createproduct', {
                title: this.formTitle,
                description: this.formDescription,
                img_url: this.formImgUrl,
                price: this.formPrice,
                origin: this.formOrigin
            });

            this.isValidForm = false;
            this.formTitle = '';
            this.formDescription = '';
            this.formImgUrl = '';
            this.imgPreview = './resources/default-img.png';
            this.formPrice = 0;
            this.formOrigin = 1;

            this.$emit('addproductbtn', /* data */);
        },
        onCancelCreateBtn() {
            this.$emit('addproductbtn', /* data */);
        },
        validateForm() {
            return this.formTitle.length >= 3 &&
                this.formImgUrl.length >= 3 &&
                this.formDescription.length >= 3 && 
                this.formPrice && 
                this.formOrigin;
        },
    }
}

const productItem = {
    template: `
    <div v-if="editingProduct" class="card animate__animated animate__flipInY">
        <div class="card-body">

            <div class="mb-3">
                <label for="title" class="form-label">Título:</label>
                <input type="text" id="title" v-model="titleForm" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Descripción:</label>
                <input type="text" id="description" v-model="descriptionForm" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="imgUrl" class="form-label">URL de la imagen:</label>
                <input type="text" id="imgUrl" v-model="imgUrlForm" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="price" class="form-label">Precio:</label>
                <input type="number" id="price" v-model="priceForm" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="origin" class="form-label">Origen:</label>
                <select id="origin" v-model="originForm" class="form-select" required>
                    <option value="" disabled>Selecciona un país</option>
                    <option v-for="(country, index) in countries" :key="index" :value="country.id">
                        {{ country.name }}
                    </option>
                </select>
            </div>
            <div class="d-flex justify-content-between">
                <button @click="onSaveProductBtn" class="btn btn-success btn-sm">
                    <i class="fa-solid fa-floppy-disk"></i>
                    Guardar
                </button>
                <button @click="onDeleteProductBtn" class="btn btn-danger btn-sm">
                    <i class="fa-solid fa-trash-can"></i>
                    Borrar
                </button>
                <button @click="onCancelAdminBtn" class="btn btn-secondary btn-sm">
                    <i class="fa-solid fa-xmark"></i>
                    Cancelar
                </button>
            </div>

        </div>
    </div>

    <div v-if="!editingProduct" class="card animate__animated animate__fadeIn">
        <img :src="product.img_url" class="card-img-top" :alt="product.title">
        <div class="card-body">
            <h5 class="card-title">{{ product.title }}</h5>
            <p class="card-text">{{ product.description }}</p>
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item">Precio: $ {{ parseFloat(product.price).toFixed(2) }}</li>
            <li class="list-group-item">Origen: {{ getCountryName(product.origin) }}</li>
        </ul>
        <div v-if="!settingQuant" class="card-body d-flex justify-content-between">
            <button @click="onCartBtn" class="btn btn-success">
                <i class="fa-solid fa-cart-plus"></i>
                Agregar
            </button>
            <button @click="onAdminBtn" v-if="auth_lvl === 'admin'" class="btn btn-info">
                <i class="fa-solid fa-wrench"></i>
                Administrar
            </button>
        </div>
        <div v-if="settingQuant" class="card-body d-flex justify-content-between animate__animated animate__flipInX">
            <div class="input-group">
                <label for="quantity" class="form-label me-2">Cantidad:</label>
                <input type="number" id="quantity" v-model="quantForm" class="form-control" required  min="1">
            </div>
            <div class="btn-group">
                <button @click="onSendCartBtn" class="btn btn-success">
                    <i class="fa-solid fa-cart-plus"></i>
                    Agregar
                </button>
                <button @click="onCancelCartBtn" class="btn btn-secondary">
                    <i class="fa-solid fa-xmark"></i>
                    Cancelar
                </button>
            </div>
        </div>
    </div>
    `,
    props: ['product', 'auth_lvl'],
    emits: ['sendToCart', 'updateProduct', 'deleteProduct'],
    data() {
        return {
            // Para manejar carrito
            settingQuant: false,
            quantForm: 1,
            // Para manejar edicion de producto
            editingProduct: false,
            titleForm: '',
            descriptionForm: '',
            imgUrlForm: '',
            priceForm: 0,
            originForm: 1,
            // Otros datos
            countries: [
                {id: 1, name: 'Afganistán'},
                {id: 2, name: 'Argelia'},
                {id: 3, name: 'Samoa Americana'},
                {id: 4, name: 'Angola'},
                {id: 5, name: 'Anguila'},
                {id: 6, name: 'Argentina'},
                {id: 7, name: 'Armenia'},
                {id: 8, name: 'Australia'},
                {id: 9, name: 'Austria'},
                {id: 10, name: 'Azerbaiyán'},
                {id: 11, name: 'Baréin'},
                {id: 12, name: 'Bangladés'},
                {id: 13, name: 'Bielorrusia'},
                {id: 14, name: 'Bolivia'},
                {id: 15, name: 'Brasil'},
                {id: 16, name: 'Brunéi'},
                {id: 17, name: 'Bulgaria'},
                {id: 18, name: 'Camboya'},
                {id: 19, name: 'Camerún'},
                {id: 20, name: 'Canadá'},
                {id: 21, name: 'Chad'},
                {id: 22, name: 'Chile'},
                {id: 23, name: 'China'},
                {id: 24, name: 'Colombia'},
                {id: 25, name: 'República Democrática del Congo'},
                {id: 26, name: 'República Checa'},
                {id: 27, name: 'República Dominicana'},
                {id: 28, name: 'Ecuador'},
                {id: 29, name: 'Egipto'},
                {id: 30, name: 'Estonia'},
                {id: 31, name: 'Etiopía'},
                {id: 32, name: 'Islas Feroe'},
                {id: 33, name: 'Finlandia'},
                {id: 34, name: 'Francia'},
                {id: 35, name: 'Guayana Francesa'},
                {id: 36, name: 'Polinesia Francesa'},
                {id: 37, name: 'Gambia'},
                {id: 38, name: 'Alemania'},
                {id: 39, name: 'Grecia'},
                {id: 40, name: 'Groenlandia'},
                {id: 41, name: 'Ciudad del Vaticano'},
                {id: 42, name: 'Hong Kong'},
                {id: 43, name: 'Hungría'},
                {id: 44, name: 'India'},
                {id: 45, name: 'Indonesia'},
                {id: 46, name: 'Irán'},
                {id: 47, name: 'Irak'},
                {id: 48, name: 'Israel'},
                {id: 49, name: 'Italia'},
                {id: 50, name: 'Japón'},
                {id: 51, name: 'Kazajistán'},
                {id: 52, name: 'Kenia'},
                {id: 53, name: 'Kuwait'},
                {id: 54, name: 'Letonia'},
                {id: 55, name: 'Liechtenstein'},
                {id: 56, name: 'Lituania'},
                {id: 57, name: 'Madagascar'},
                {id: 58, name: 'Malaui'},
                {id: 59, name: 'Malasia'},
                {id: 60, name: 'México'},
                {id: 61, name: 'Moldavia'},
                {id: 62, name: 'Marruecos'},
                {id: 63, name: 'Mozambique'},
                {id: 64, name: 'Birmania'},
                {id: 65, name: 'Nauru'},
                {id: 66, name: 'Nepal'},
                {id: 67, name: 'Países Bajos'},
                {id: 68, name: 'Nueva Zelanda'},
                {id: 69, name: 'Nigeria'},
                {id: 70, name: 'Corea del Norte'},
                {id: 71, name: 'Omán'},
                {id: 72, name: 'Pakistán'},
                {id: 73, name: 'Paraguay'},
                {id: 74, name: 'Perú'},
                {id: 75, name: 'Filipinas'},
                {id: 76, name: 'Polonia'},
                {id: 77, name: 'Puerto Rico'},
                {id: 78, name: 'Rumanía'},
                {id: 79, name: 'Reunión'},
                {id: 80, name: 'Federación de Rusia'},
                {id: 81, name: 'San Vicente y las Granadinas'},
                {id: 82, name: 'Arabia Saudita'},
                {id: 83, name: 'Senegal'},
                {id: 84, name: 'Eslovaquia'},
                {id: 85, name: 'Sudáfrica'},
                {id: 86, name: 'Corea del Sur'},
                {id: 87, name: 'España'},
                {id: 88, name: 'Sri Lanka'},
                {id: 89, name: 'Sudán'},
                {id: 90, name: 'Suecia'},
                {id: 91, name: 'Suiza'},
                {id: 92, name: 'Taiwán'},
                {id: 93, name: 'Tanzania'},
                {id: 94, name: 'Tailandia'},
                {id: 95, name: 'Tonga'},
                {id: 96, name: 'Túnez'},
                {id: 97, name: 'Turquía'},
                {id: 98, name: 'Turkmenistán'},
                {id: 99, name: 'Tuvalu'},
                {id: 100, name: 'Ucrania'},
                {id: 101, name: 'Emiratos Árabes Unidos'},
                {id: 102, name: 'Reino Unido'},
                {id: 103, name: 'Estados Unidos'},
                {id: 104, name: 'Venezuela'},
                {id: 105, name: 'Vietnam'},
                {id: 106, name: 'Islas Vírgenes de los Estados Unidos'},
                {id: 107, name: 'Yemen'},
                {id: 108, name: 'Yugoslavia'},
                {id: 109, name: 'Zambia'}
            ]
        }
    },
    mounted() {
        this.titleForm = this.product.title;
        this.descriptionForm = this.product.description;
        this.imgUrlForm = this.product.img_url;
        this.priceForm = this.product.price;
        this.originForm = this.product.origin;
    },
    methods: {
        onCartBtn() {
            this.settingQuant = true;
        },
        onSendCartBtn(){
            this.$emit('sendToCart', {itemId: this.product.id, quantity: this.quantForm});
            this.quantForm = 1;
            this.settingQuant = false;
        },
        onCancelCartBtn(){
            this.quantForm = 1;
            this.settingQuant = false;
        },
        onAdminBtn() {
            this.editingProduct = true;
        },
        onSaveProductBtn() {
            if(!this.validateForm()) {
                alert('Por favor compruebe los valores antes de enviar el formulario.');
                return;
            }
            this.$emit('updateProduct',{id: this.product.id,
                title: this.titleForm, 
                description: this.descriptionForm,
                img_url: this.imgUrlForm,
                price: this.priceForm,
                origin: this.originForm
            });
            this.editingProduct = false;
        },
        onDeleteProductBtn() {
            this.$emit('deleteProduct', this.product.id)
        },
        onCancelAdminBtn() {
            this.editingProduct = false;
        },
        validateForm() {
            return (this.titleForm.length >= 3 &&
                this.imgUrlForm.length >= 3 &&
                this.descriptionForm.length >= 3 && 
                this.priceForm && 
                this.originForm) && 
                (this.titleForm !== this.product.title || 
                    this.descriptionForm !== this.product.description || 
                    this.imgUrlForm !== this.product.img_url || 
                    this.priceForm !== this.product.price || 
                    this.originForm !== this.product.origin )
        },
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
    }
}

const productsList = {
    template: `
    <div class="container mt-5 product-list animate__animated animate__fadeInLeft">
        <h2 class="mb-4">Productos</h2>
        <div class="row">
            <div v-for="product in products" :key="product.id" class="col-md-4">
                <div class="mb-4">
                    <product :product="product" :auth_lvl="auth_lvl" @sendToCart="handleAddToCart" @updateProduct="handleUpdateProduct" @deleteProduct="handleDeleteProduct"></product>
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
            cartId: 1,
            cartQuantity: 2
        };
    },
    methods: {
        handleAddToCart(form) {
            this.$emit('sendtocart', {itemId: form.itemId, quantity: form.quantity});
        },
        handleUpdateProduct(form) {
            this.$emit('editproduct', form);
        },
        handleDeleteProduct(data) {
            this.$emit('deleteproduct', data);
        }
    },
}
