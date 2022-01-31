const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const verify = require('../config/verify');
const swal = require('sweetalert');
const flash = require('connect-flash');


//Get register Page
router.get('/register', (req, res) => {

    res.render('register', {
        title: 'Register'
    });
});




//Get Login
router.get('/login', (req, res, next) => {
    
    if(res.locals.user)res.redirect('/');
    res.render('login', {
        title: 'Log in'
    });
    next()
});



//Post Register Page
router.post('/register',   async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    var password2 = req.body.password2;

    req.checkBody('name', 'Name is required !').notEmpty();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('username', 'Username is required!').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();
    if(errors) {
        res.render('register', {
            errors: errors,
            user: null,
            title: 'Register'
        });
    } else {
        
  const userExists = await User.findOne({username: req.body.username})
    if(userExists) {
        req.flash('Danger', 'Username Already Exists')
        } else {
                let salt = await bcrypt.genSalt(10);
               let hash = await bcrypt.hash(req.body.password, salt);

                let user = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: hash, 
                    admin: 0,
                });

               await user.save();
               const token = user.generateAuthToken()
                req.flash('success', 'You are now registered');
                res.header('auth-token', token);
                res.redirect('/users/login');
               }
            }
})



 
//Post Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next);
});

 /*

router.post('/login', async (req, res) => {
const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})
 
const {error} = schema.validate(req.body);
if(error) { res.status(400).send(error.details[0].message)}

let user = await User.findOne({username: req.body.username})
console.log(user)
if(!user) {
    console.log('Username not found');
    req.flash('danger', ' Invalid Username or Password');
    res.redirect('/users/login');
} else {  
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) {
    console.log('Wrong password');
    req.flash('danger', 'Invalid Username or Password');
    res.redirect('/users/login');
    } else {
    const token = user.generateAuthToken();  
    console.log(token)
    res.header('Access-Control-Expose-Headers','auth-token').header('auth-token', token).redirect('/');
    }
}
});
*/


// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/users/login',
//     failureFlash: true
// }) )



//Get Logged In User
router.get('/me',  verify.isUser,  async (req, res)=>{
   const user = await User.findById(req.user._id).select('-password');
   res.send(user);

})





//Get Logout
router.get('/logout', (req, res) => {

    req.logout();
    req.flash('success', 'You are now logged out');
    res.redirect('/users/login');
});




module.exports = router;