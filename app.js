const mongoose = require('mongoose');
const Page = require('./models/pages_model');
const Category = require('./models/categorymodel');
const path = require('path');
const passport = require('passport');
const pages = require('./routes/pages');
const users = require('./routes/users');
const products = require('./routes/products'); 
const cart = require('./routes/cart');
const adminPages = require('./routes/admin_pages');
const adminCategories = require('./routes/admin_categories');
const adminProducts = require('./routes/admin_products');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectFlash = require('connect-flash');
const expressValidator = require('express-validator');
const fileUpload = require('express-fileupload');
const express = require('express');
const app = express();



//Mongoose Connection
mongoose.connect('mongodb://localhost/shopping-cart')
.then(() => console.log("Connected to mongoDB"))
.catch( err => console.error("Failed to connect to mongoDB", err));



// View Engine setup
app.set('views', path.join(__dirname, 'views' ));
app.set('view engine', 'ejs');


//Public folder setup
app.use(express.static(path.join(__dirname, 'public')));


//Set global errors variable
app.locals.errors = null;

//Express File-Upload middleware
app.use(fileUpload());

//Body-Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    //cookie: {secure: true}
}));

// Express Validator Middleware
//Note Version must be @5.3.1
 app.use(expressValidator({
     errorFormatter: function(param, msg, value) {
         let namespace = param.split('.')
         ,root = namespace.shift()
         , formParam = root;

         while(namespace.length) {
             formParam += '[' + namespace.shift + ']';
         }
         return {
             param : formParam,
             msg: msg,
             value: value
         };
     }, 
     customValidators: {
         isImage: function(value, filename) {
             var extension = (path.extname(filename)).toLowerCase();
             switch(extension) {
                 case '.jpg': return '.jpg';
                 case '.jpeg': return '.jpeg';
                 case '.png': return '.png';
                  case '': return '.jpg';
                default: return false;
             }
         }
     }
 }));


//Express Messages middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


app.use(express.json());
app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);
app.use('/products', products);
app.use('/users', users);
app.use('/cart', cart);
app.use('/', pages); 

//Passport config
require('./config/passport')(passport);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Sessions midlleware
app.get('*', (req, res, next)=>{
    res.locals.cart = req.session.cart;
    res.locals.user = req.user || null;
    next();
});


//Uncaught Exception
process.on('uncaughtException', (ex) => {
    console.log('There is an UNCAUGHT EXCEPTION');
    process.exit(1);
});

//Unhandled Rejection
process.on('unhandledRejection', (ex)=>{
    console.log('There is an UNHANDLED REJECTION');
    process.exit(1);
})

//Get all pages to pass to header.ejs
Page.find({}).sort({sorting: 1}).exec((err, pages) => {
    if(err){
        console.log(err);
    } else {
        app.locals.pages = pages;
    }
});


//Get all categories to pass to header.ejs
Category.find((err, categories) => {
    if(err){
        console.log(err);
    } else {
        app.locals.categories = categories;
    }
});





const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`Listening at port ${port}.....`)});