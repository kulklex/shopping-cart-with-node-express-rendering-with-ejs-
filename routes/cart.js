const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const Product = require('../models/product');




// Get add Products to cart
router.get('/add/:product', (req, res) => {
    let slug = req.body.product;
    
    Product.findOne({slug: slug}, (err, p)=>{
        if (err){
        console.log(err);
        }

        if(typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: slug,
                qty: 1,
                price: parseFloat(p.price).toFixed(2),
                image: '/product_images/' + p._id + '/' + p.image
            });
        } else {
            let cart = req.session.cart;
            let newItem = true;

            for(var i=0; i< cart.length; i++) {
                if (cart[i].title == slug) {
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                cart.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(p.price).toFixed(2),
                    image: '/product_images/' + p._id + '/' + p.image
                });
            }
        }

            //console.log(req.session.cart);
            req.flash('Success', 'Product Added');
            res.redirect('back');
    });
});


//Get chekout page
router.get('/checkout', (req, res)=>{

    if(req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart;
        res.redirect('/cart/checkout');
    } else {
        res.render('checkout', {
            title: 'checkout',
            cart: req.session.cart
        });
    }
    
});

//Get Update product
router.get('/update/:product', (req, res)=> {
    let slug = req.body.product;
    let cart = req.session.cart;
    let action = req.query.action;

    for(let i = 0; i < cart.length; i++) 
    {
        if (cart[i].title == slug) {
            switch (action) {
                case "add": 
                    cart[i].qty++;
                    break;
                case "remove":
                    cart[i].qty--;
                    if(cart[i].qty < 1) cart.splice(i, 1);
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if (cart.length == 0) delete req.session.cart;
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }
    req.flash('success', 'Added to cart')
    res.redirect('/cart/checkout');
});


router.get('/clear', (req, res) => {
    delete req.session.cart;
    req.flash('success', 'Cart Cleared');
    res.redirect('/cart/checkout');
})



router.get('/buynow', (req, res) => {
    delete req.session.cart;
    res.status(400);
})


module.exports = router;