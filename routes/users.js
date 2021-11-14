const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcryptjs');

//Get register Page
router.get('/register', (req, res) => {

    res.render('register', {
        title: 'Register'
    });
});


//Post Register Page
router.post('/register', (req, res) => {
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
        User.findOne({username: username}), function(err, user) {
            if(err){
                console.log(err);
            }
            if(user) {
                req.flash('danger', 'Username exits');
                res.redirect('/users/register');
            } else {
                let user = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: password, 
                    admin: 1
                });

                user.save(function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                       req.flash('success', 'You are now registered');
                       res.redirect('/users/login');
                    }
                });

                bcrypt.genSalt(10, (err, salt)=> {
                    if(err) {console.log(err);}
                    bcrypt.hash(user.password, salt, (err, hash)=>{
                        if(err) {console.log(err);}

                        user.password = hash;
                    });
                });
                    
                  
                
            }
        }
    }
})

//Get Login
router.get('/login', (req, res) => {

    if(res.locals.user)
    {
        res.redirect('/');
    }
    res.render('login', {
        title: 'Log in'
    });
});

//Post Login
router.post('/login', (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    }) (req, res, next);
});



//Get Logout
router.get('/logout', (req, res) => {

    req.logout;

    req.flash('success', 'You are now logged out');
    res.redirect('/users/login');
});
module.exports = router;