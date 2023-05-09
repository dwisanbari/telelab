// modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

// controllers
const UsersController = require('./controllers/userController');

// applications
const app = express();

// setup view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

// Middleware
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'mysecretkey', // ubah sesuai dengan key rahasia Anda
    resave: false,
    saveUninitialized: true
}));

// routes
app.get('/', UsersController.index);
app.post('/',UsersController.create);
app.get('/register', UsersController.register);
app.get('/login', UsersController.index);
app.post('/login', UsersController.login);
app.get('/home', UsersController.home);
app.get('/logout', UsersController.logout);

// error handling
app.use((req,res,next)=>{
    res.status(404).render('error',{message:"page not found"});
})

app.use((err,req,res,next)=>{
    res.status(500).render('error',{message:err.message});
})

// start server
app.listen(3000,()=>{
    console.log(`server is running on http://localhost:3000`);
});
