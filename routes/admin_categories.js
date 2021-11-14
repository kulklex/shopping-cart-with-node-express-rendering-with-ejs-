const express = require('express');
const router = express.Router();
const connectFlash = require('connect-flash');
const Category = require('../models/categorymodel');







router.get('/',  (req, res) => {
    Category.find((err, categories) => {
        if (err) return console.log(err);
        res.render('admin/categories', {
            categories: categories
        });
    })
    
});

//Get Add Category
router.get('/add-category', (req, res) => {
    let title = '';
    res.render('admin/add_category', {
        title: title,
       
    });
});

router.post('/add-category',  (req, res) => {
    
    req.checkBody('title', 'Title must have a value').notEmpty();
    
    let title = req.body.title;
    let slug =  title.replace(/\s+/g, '-').toLowerCase();
   
    let errors = req.validationErrors();
    if(errors) {
        res.render('admin/add_category', {
            errors: errors,
            title: title
        });
    }
    
    else {
        Category.findOne({slug: slug}, (err, category) => {
            if(category) {
                req.flash('danger', 'Category title exists, choose another.');
                res.render('admin/add_category', {
                    errors: errors,
                    title: title
                });
            } else {
                let category = new Category({
                    title: title,
                    slug: slug
                });
                category.save(function(err) {
                    if(err) return console.log(err);   
                    Category.find((err, categories) => {
                                if(err){
                                    console.log(err);
                                 } else {
                                         req.app.locals.categories = categories;
                                         }
                    });
                    req.flash('success', 'Category  added');
                    res.redirect('/admin/categories'); 
                });
            }
        });
    }      
});


//Get Edit Category
router.get('/edit-category/:id', (req, res) => {
    Category.findById(req.body.id, (err, category)=> {
        if(err) return console.log(err);
        
    res.render('admin/edit_category', {
        title: category.title,
        id: category._id
    });
    });
});


//Post Edit Category

router.post('/edit-category/:id',  (req, res) => {
    
    req.checkBody('title', 'Title must have a value').notEmpty();
   
    let title = req.body.title;
    let slug  = title.replace(/\s+/g, '-').toLowerCase();
    let id = req.body.id;

    let errors = req.validationErrors();
    if(errors) {
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        });
    }
    
    else {
        Category.findOne({slug: slug, _id:{'$ne':id}}, (err, category) => {
            if(category) {
                req.flash('danger', 'category title already exists, choose another.');
                res.render('admin/edit_category', {
                    title: title,
                    id: id
                });
            } else {
                Category.findById(id, (err, category) => {
                    if (err) return console.log(err);

                    category.title = title;
                    category.slug = slug;
                    
                    category.save((err) => {
                        if (err) return console.log(err);
                        Category.find((err, categories) => {
                            if(err){
                                console.log(err);
                             } else {
                                     req.app.locals.categories = categories;
                                     }
                        });
                        req.flash('success', 'Category edited!');
                        res.redirect('/admin/categories/edit-category/'+ id); 
                    });
                });

                
            }
        });
    }  
      
});

// Delete Category
router.get('/delete-category/:id',  (req, res) => {
    Category.findByIdAndRemove(req.body.id, (err) => {
        if (err) return console.log(err);
        Category.find((err, categories) => {
            if(err){
                console.log(err);
             } else {
                     req.app.locals.categories = categories;
                     }
        });
        req.flash('success', 'Category deleted');
        res.redirect('/admin/categories'); 
    })
    
});
 

module.exports = router;