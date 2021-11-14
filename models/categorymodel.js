const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }
});


const Category = mongoose.model('Category', categorySchema);

async function createCategory() {
    const categ = new Category({
        title: 'drinks',
        slug: 'drinks'
    });

    const result = await categ.save();
    console.log(result);
}



module.exports = Category;