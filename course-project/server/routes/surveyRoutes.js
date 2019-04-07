const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
    app.get('/api/surveys/thanks', (req, res) => {
        res.send('Thanks for voting!');
    });
    
    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
        const { title, subject, body, recipients } = req.body;

        const survey = new Survey({
            title, // same as { title: title }
            subject,
            body,
            // the return block here requires a set of () so the interpretor doesn't think
            // our object {} are beginning a return block
            recipients: recipients.split(',').map(email => ({ email: email.trim() })),
            _user: req.user.id,
            dateSent: Date.now()
        });
        
        // create our mailer to send
        const mailer = new Mailer(survey, surveyTemplate(survey));
        
        try {
            // Send our Email
            await mailer.send();
    
            // save suvey to db
            await survey.save();
    
            // deduct a credit from our user and save our user to our db
            req.user.credits -= 1;
            const user = await req.user.save();
    
            // finally, send back our usel model
            res.send(user);
        } catch (err) {
            res.status(422).send(err);  
        }
    });
};