const Joi = require('joi');

var UserSchema = Joi.object().keys({
    name: Joi.string().trim().min(4),
    email: Joi.string().email(),
    password: Joi.string().trim().min(5)
});

module.exports = validateUser = (req, res, next) => {
    console.log('In user validation ' + req.body.email);
    Joi.validate(req.body, UserSchema, (err, value) => {
        if (err) {
            res.json({
                msg: err.message
            });
        } else {
            next();
        }
    });
};