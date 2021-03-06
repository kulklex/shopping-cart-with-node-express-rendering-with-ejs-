const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const _ = require('lodash');
const path = require('path');
const Paystack = require('../models/paystackModel');



const paystack = require('../config/paystack')(request);


const router = express.Router()
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));
router.use(express.static(path.join(__dirname, 'public/')));

router.post('/paystack/pay', (req, res) => {
    const form = _.pick(req.body,['amount','email','full_name']);
    form.metadata = {
        full_name : form.full_name
    }
    form.amount *= 100;
   
    paystack.initializePayment(form, (error,  body)=>{
        if(error){
            //handle errors
            console.log(error);
            return res.redirect('/error')
        }
        response = JSON.parse(body);
        res.redirect(response.data.authorization_url)

        });
})

router.get('/paystack/callback', (req,res) => {
    const ref = req.query.reference;
    paystack.verifyPayment(ref, (error,body)=>{
        if(error){
            //handle errors appropriately
            console.log(error)
            return res.redirect('/error');
        }
        response = JSON.parse(body);        

        const data = _.at(response.data, ['reference', 'amount','customer.email', 'metadata.full_name']);

        [ amount, email, full_name] =  data;
        
        newPay = { amount, email, full_name}

        const pay = new Paystack(newPay)

        pay.save().then((pay)=>{
            if(!pay){
                return res.redirect('/error');
            }
            res.redirect('/receipt/'+pay._id);
        }).catch((e)=>{
            res.redirect('/error');
        })
    })
});


router.get('/receipt/:id', (req, res)=>{
    const id = req.params.id;
    Paystack.findById(id).then((pay)=>{
        if(!pay){
            //handle error when the donor is not found
            res.redirect('/error')
        }
        res.render('success',{pay});
    }).catch((e)=>{
        res.redirect('/error')
    })
})

router.get('/error', (req, res)=>{
    res.render('error');
})






module.exports = router;