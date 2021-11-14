const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const Product = require('../models/product');
const Category = require('../models/categorymodel');



// Get All Products
router.get('/', (req, res) => {

    Product.find((err, products)=> {
        if(err){ 
        console.log(err);
        }
         res.render('all_products', {
                title: 'All products',
                products: products
            });
    });
});



//Get products by Categories
router.get('/:category', (req, res) => {
    let categorySlug = req.body.category;

    Category.findOne({slug: categorySlug}).then((page) => {
        Product.find({category: categorySlug}).then( (err, products) => {
            if(err){
            console.log(err);
            res.statusCode = 500;
            res.end('error');
            }
             res.render('cat_products', {
                    title: title,
                    products: products
                });
            
        });
    }).catch((e)=> {
        res.status(400).send(e);
    });
});


//Get Product details
router.get('/:category/:product', (req, res) => {
    let galleryImages = null;

    Product.findOne({slug: req.body.product}, (err, product)=> {
        if (err){
        console.log(err);
        } else {
            let galleryDir = 'public/product_images/' + product._id + '/gallery';

            fs.readdir(galleryDir, (err, files)=> {
                if (err) {
                    console.log(err);
                } else {
                    galleryImages = files;

                    res.render('product', {
                        title: product.title,
                        p: product,
                        galleryImages: galleryImages
                    });
                }
            });
        }
    });
});


module.exports = router;