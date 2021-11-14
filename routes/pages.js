const express = require('express');
const router = express.Router();
const Page = require('../models/pages_model');


router.get('/', (req, res) => {

    Page.findOne({slug: 'home'}, (err, page)=> {
        if(err)
        console.log(err);

         res.render('index', {
                title: page.title,
                content: page.content
            })
    });
});


//Get Page
router.get('/:slug', (req, res) =>{
    let slug = req.body.slug;

    Page.findOne({slug: slug}, (err, page)=> {
        if(err)
        console.log(err);

        if(!page) {
            res.redirect('/');
        } else {
            res.render('index', {
                title: page.title,
                content: page.content
            })
        }
    });
})

module.exports = router;