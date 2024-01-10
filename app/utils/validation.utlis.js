const Joi = require("joi")

const registerValidation =Joi.object({
    fullname: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  })
 


// Login validation
const loginValidation = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  })


module.exports = { registerValidation, loginValidation }
