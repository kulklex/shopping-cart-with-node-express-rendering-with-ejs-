const mongoose = require('mongoose');


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

UserSchema.pre("save", (next)=>{
    console.log(this);
    console.log('i see this log');
    next();
});

const User = mongoose.model('User', UserSchema, "user");

module.exports = User;  