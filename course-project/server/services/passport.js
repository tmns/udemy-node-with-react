const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const keys = require('../config/keys');

const User = mongoose.model('users'); // our Mongoose Model Class, which corresponds to MongoDB Collection

passport.serializeUser((user, done) => {
    // callback we must execute for passport, first arg is error or null 
    // we utilize user.id here to identify the unique user record in our db
    done(null, user.id);  
});

passport.deserializeUser((id, done) => {
    User.findById(id)
    .then(user => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true // to deal with heroku proxy issues
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({ googleId: profile.id })
            .then(existingUser => {
                if (existingUser) {
                    done(null, existingUser);   
                } else {
                    new User({ // creates our Mongoose Model Instance
                        googleId: profile.id
                    })
                    .save() // save it to MongoDB as a new Record
                    .then(user => done(null, user));
                }
            });
        }
    )
);