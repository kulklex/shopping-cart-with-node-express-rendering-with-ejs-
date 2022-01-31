const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    admin: {
        type: Number
    }
});


UserSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id}, process.env.ACCESS_TOKEN_SECRET)
    return token;
}


const User = mongoose.model('User', UserSchema);


module.exports = User;  