const mongoose = require('mongoose')


const paystackSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    amount: {
        type: Number,
        required: true
    }
})

const Paystack = mongoose.model('Paystack', paystackSchema)

module.exports  = Paystack