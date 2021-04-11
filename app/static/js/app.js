/* Add your Application JavaScript */
// Instantiate our main Vue Instance
const app = Vue.createApp({
    data() {
        return {

        }
    }
});

const uploadform = {
    name: 'upload-form',
    template: `
    <h1 id="form-heading">Upload Form</h1>

    <div class="alert alert-success" v-if="isSuccess">
        <p v-for="success in successMessage">{{ success.message }}</p>
    </div>
    <div class="alert alert-danger" v-if="isError">
        <ul>
            <li v-for="error in errors">{{ error }}</li>
        </ul>
    </div>

    <form method="POST" action="" id="uploadForm" @submit.prevent="uploadPhoto">

        <div class="form-group">
            <label class="form-label" for="description">Description</label><br>
            <textarea name="description" id="description" class="form-element"></textarea><br>
            <label class="form-label" for="photo">Photo</label><br>
            <input type="file" id="photo" class="form-element" name="photo" accept="image/x-png,image/jpg">
        </div>

        <button type="submit" name="submit" class="btn btn-primary">Upload</button>
    
    </form>
    `,
    data: function() {
        return {
            errors: [],
            successMessage: [],
            isSuccess: false,
            isError: false
        };
    },
    methods: {
        uploadPhoto: function() {
            let self = this;
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);

            fetch("/api/upload", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'        
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                console.log('success');
                console.log(jsonResponse);

                if (jsonResponse.errors){
                    self.isError= true;
                    self.isSuccess = false;
                    self.errors = jsonResponse.errors;
                } else if (jsonResponse.upload){
                    self.isError = true;
                    self.isSuccess= false;
                    self.successMessage = jsonResponse.upload;
                }

            })
            .catch(function(error) {
                console.log(error);
            });
    
        }
    }
};

app.component('app-header', {
    name: 'AppHeader',
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/upload">Upload </router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

app.component('app-footer', {
    name: 'AppFooter',
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
    data() {
        return {
            year: (new Date).getFullYear()
        }
    }
});

const Home = {
    name: 'Home',
    template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
    `,
    data() {
        return {}
    }
};

const NotFound = {
    name: 'NotFound',
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data() {
        return {}
    }
};

// Define Routes
const routes = [
    { path: "/", component: Home },
    // Put other routes here
    {path: "/upload", component: uploadform},
    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');