const passport = require('passport');

module.exports = app => {
    app.get(
        '/auth/google', 
        passport.authenticate('google', {   
            scope: ['profile', 'email']
        })
    );

    app.get('/auth/google/callback', passport.authenticate('google'));

    app.get('/api/logout', (req, res) => {
        req.logout(); // a function attached automagically to req object by Passport
        res.send('You\'ve logged out.');
    });
    
    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });
}


