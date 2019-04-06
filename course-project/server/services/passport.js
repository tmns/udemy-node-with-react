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

        async (accessToken, refreshToken, profile, done) => {    
            const existingUser = await User.findOne({ googleId: profile.id });
            
            if (existingUser) {
                return done(null, existingUser);   
            }
            // creates our Mongoose Model Instance with new User and
            // and saves it to MongoDB as a new Record
            const user = await new User({ googleId: profile.id }).save();
            done(null, user);
        }
    )
);