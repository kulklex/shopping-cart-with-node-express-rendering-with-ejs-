const express = require('express');
const router = express.Router();
const verify = require('../config/verify');
const Page = require('../models/pages_model');



router.get('/', verify.isAdmin, (req, res) => {
    Page.find({}).sort({sorting: 1}).exec((err, pages) => {
        res.render('admin/pages', {
            pages:pages
        });
    })
    
});

//Get Add Page
router.get('/add-page', verify.isAdmin, (req, res) => {
    let title = '';
    let slug = '';
    let content = '';

    res.render('admin/add_page', {
        title: title,
        slug: slug,
        content: content
    });
});

router.post('/add-page',  (req, res) => {
    
    req.checkBody('title', 'Title must have a value').notEmpty();
    req.checkBody('content', 'Content must have a value').notEmpty();


    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    let content = req.body.content;
    let errors = req.validationErrors();
    if(errors) {
        res.render('admin/add_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    }
    
    else {
        Page.findOne({slug: slug}, (err, page) => {
            if(page) {
                req.flash('danger', 'page slug exist, choose another.');
                res.render('admin/add_page', {
                    errors: errors,
                    title: title,
                    slug: slug,
                    content: content
                });
            } else {
                let page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                });
                page.save(function(err) {
                    if(err) 
                    return console.log(err);

                    Page.find({}).sort({sorting: 1}).exec((err, pages) => {
                        if(err){
                            console.log(err);
                        } else {
                            req.app.locals.pages = pages;
                        }
                    })
                    req.flash('success', 'Page added');
                    res.redirect('/admin/pages'); 
                });
            }
        });
    }
    
      
});


//Get Edit Page
router.get('/edit-page/:id', verify.isAdmin, (req, res) => {
    Page.findById( req.params.id, (err, page)=> {
        if(err) {return console.log(err);}
        else {
    res.render('admin/edit_page', {
        title: page.title,
        slug: page.slug,
        content: page.content,
        id: page._id
    });
    }
    });
});


//Post Edit Page

router.post('/edit-page/:id',  (req, res) => {
    
    req.checkBody('title', 'Title must have a value').notEmpty();
    req.checkBody('content', 'Content must have a value').notEmpty();


    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    let content = req.body.content;
    let id = req.params.id;

    let errors = req.validationErrors();
    if(errors) {
        res.render('admin/edit_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id: id
        });
    }
    
    else {
        Page.findOne({slug: slug, _id:{'$ne':id}}, (err, page) => {
            if(page) {
                req.flash('danger', 'page slug exist, choose another.');
                res.render('admin/edit_page', {
                    title: title,
                    slug: slug,
                    content: content,
                    id: id
                });
            } else {
                Page.findById(id, (err, page) => {
                    if (err) return console.log(err);

                    page.title = title;
                    page.slug = slug;
                    page.content = content;

                    page.save((err) => {
                        if (err) return console.log(err);

                        Page.find({}).sort({sorting: 1}).exec((err, pages) => {
                            if(err){
                                console.log(err);
                            } else {
                                req.app.locals.pages = pages;
                            }
                        });

                        req.flash('success', 'Page edited!');
                        res.redirect('/admin/pages'); 
                    });
                });

                
            }
        });
    }  
      
});

// Delete page
router.get('/delete-page/:id', verify.isAdmin,  (req, res) => {
    Page.findByIdAndRemove(req.params.id, (err) => {
        if (err) return console.log(err);

        Page.find({}).sort({sorting: 1}).exec((err, pages) => {
            if(err){
                console.log(err);
            } else {
                req.app.locals.pages = pages;
            }
        });

        req.flash('success', 'Page deleted');
        res.redirect('/admin/pages'); 
    })
    
});
 
//Sort pages Function
function sortPages(ids, callback) {
    var count = 0;

    for( var i = 0; i < ids.length; i++) {
        var id = ids[i];
        count++;

        (function(count) {
            Page.findById(id,  (err, page) => {
                if(err){
                    console.log(err);
                } else{
                    page.sorting = count;
                    page.save(function(err){
                        if(err)
                            return console.log(err);
                            ++count;
                            if(count >= ids.length){
                                callback();
                            }
                        
                    });
                }
            });
        }) (count);
    } 
}

//Post Re-order Pages

router.post('/reorder-pages',  (req, res) => {
    console.log(req.body);
    var ids = req.body['id[]'];
    console.log(ids);
    sortPages(ids, ()=>{
        Page.find({}).sort({sorting: 1}).exec((err, pages) => {
            if(err){
                console.log(err);
            } else {
                req.app.locals.pages = pages;
            }
        });
    })
    
});


module.exports = router;