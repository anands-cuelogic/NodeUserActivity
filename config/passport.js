const JWTStretagy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

const User = require('../models/User');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(new JWTStretagy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then((user) => {
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            })
            .catch((err) => {
                console.log('JWT error ' + err);
            });
    }));
};