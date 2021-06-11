const Joi = require('joi');


//email
const email = Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } });
//name
const name = Joi.string().min(3).max(50).required();
//company
const company = Joi.string().min(3).max(50).required();
//address
const address = Joi.string().min(3).max(100).required();
//phone
const phone = Joi.number().min(8).max(13).required();
//password
const password= Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'));
const pin = Joi.number().min(6).max(10).required();


//validate registeration form
const registerationValidation = async(req, res, next) => {
    const schema = Joi.object({name, company, address, phone, email, password});
    const value = schema.validate(req.body);
    console.log(value);
    if(value.error){
        console.log(value.error)
        return res.json({status: "error", message: value.error.message}); 
    }
    next();
}

//login form validation
const loginValidation = async(req, res, next) => {
    const schema = Joi.object({email, password});
    const value = schema.validate(req.body);
    if(value.error){
        return res.json({status: "error", message: value.error.message}); 
    }
    next();
}
//validate reset password form
const resetPasswordValidation = async(req, res, next) => {
    const schema = Joi.object({email});
    const value = schema.validate(req.body);
    if(value.error){
        return res.json({status: "error", message: value.error.message}); 
    }
    next();
}
// validate password update form 
const updatePasswordValidation = async(req, res, next) => {
    const schema = Joi.object({email, pin, password});
    const value = schema.validate(req.body);
    if(value.error){
        return res.json({status: "error", message: value.error.message}); 
    }
    next();
}





module.exports = {
    registerationValidation,
    loginValidation,
    resetPasswordValidation,
    updatePasswordValidation
}
    