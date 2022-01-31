const router = require('express').Router();
const User = require('./model_testing');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');

router.use(express.json());



//hashing password for register
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(req.body.password, salt);



const schema = {
    name: Joi.string().required(),
    password: Joi.string().min(6).max(20).required()
}






router.post('/register', async (req, res)=>{
 const {error} = Joi.validate(req.body, schema)  
 if(error) {
     res.status(400).send(error.details[0].message)
 }


 let emailExist = await User.findOne({email: req.body.email});
 if (emailExist){ 
     return req.flash('Danger', 'Email already exists');
    }

    const user = new User({
     name: req.body.name,
     password: req.body.password
 });
 
  try{
    let users = await user.save();
    res.send(users)
  }catch(err){
      res.status(400).send(err);
  }

});


router.post('/login', async ()=> {
    const {error} = Joi.validate(req.body, schema)
})


module.exports = router;