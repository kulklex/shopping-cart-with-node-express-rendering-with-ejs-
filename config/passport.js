const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');


 module.exports = function(passport) {
    passport.use(new LocalStrategy(function (username, hash, done) {
        User.findOne({username: username}, function (err, user) {
            if(err)
            console.log(err);

            if(!user){
            return done(null, false, {message: 'Invalid Username or Password'})
            }

            bcrypt.compare(hash, user.password, (err, isMatch) => {
             if(err) console.log(err);
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid Username or Password'});
                }
            });
        });
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        })
    })
}
