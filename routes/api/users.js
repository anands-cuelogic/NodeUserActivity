const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const router = express.Router();

//Load User module
const User = require('../../models/User');

router.get('/test', (req, res) => {
    res.json({
        msg: "User works"
    });
});

//@route     POST api/users/register
//@desc      Register User
//@access    Public
router.post('/register', (req, res) => {

    User.findOne({
        email: req.body.email
    }).then((user) => {
        if (user) {
            return res.status(400).json({
                email: 'Email already exists'
            });
        }

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then((user) => res.json(user))
                    .catch((err) => res.json(err));
            });
        });
    }).catch((err) => {});
});


//@route     POST api/users/login
//@desc      Register User
//@access    Public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //Find user by email
    User.findOne({
            email: email
        })
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    email: 'User not found'
                });
            }

            //Check password
            bcrypt.compare(password, user.password)
                .then((isMatch) => {
                    if (isMatch) {

                        //User match
                        const paylod = {
                            id: user.id,
                            name: user.name
                        }; //Create JWT payload

                        //Sign Token
                        jwt.sign(paylod, keys.secretOrKey, {
                            expiresIn: 36000
                        }, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            });
                        });

                    } else {
                        return res.status(400).json({
                            password: 'Password in correct'
                        });
                    }
                });
        });
});

//@route     POST api/users/current
//@desc      Register User
//@access    Public

router.get('/current', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.json({
        email: req.user.email,
        date: req.user.date
    });
});

module.exports = router;