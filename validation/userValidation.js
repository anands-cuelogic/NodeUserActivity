const Joi = require('joi');

const UserValidationSchema = Joi.object().keys({
    name : Joi.string().trim().min(5),
    email : Joi.string().email().trim(),
    password : Joi.string().trim().min(5)
});
module.exports = (req, res, next) => {
    console.log('In validation '+req.body);
    Joi.validate(req.body, UserValidationSchema, (err, value) => {
        if(err){
            res.status(422).json({
                message : err
            });
        }
        else{
            next();
        }
    });
}