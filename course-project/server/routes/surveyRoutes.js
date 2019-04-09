const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const Survey = mongoose.model('surveys');

const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

module.exports = app => {
    app.get('/api/surveys', requireLogin, async (req, res) => {
        const surveys = await Survey.find({
            _user: req.user.id
        }).select({ recipients: false });
        res.send(surveys);
    });
    
    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send('Thanks for voting!');
    });

    app.post('/api/surveys/webhooks', (req, res) => {
        const p = new Path('/api/surveys/:surveyId/:choice');
        _.chain(req.body)
            .map(({ email, url }) => {
                const match = p.test(new URL(url).pathname);
                if (match) {
                    return { email, surveyId: match.surveyId, choice: match.choice };
                }
            })
            .compact() // remove undefined objects from events
            .uniqBy('email', 'surveyId') // remove all duplicates
            .each(({surveyId, email, choice}) => {
                Survey.updateOne({
                    _id: surveyId, // passing our query to mongodb now so must use _id
                    recipients: {
                        $elemMatch: { email: email, responded: false }
                    }
                }, {
                    $inc: { [choice]: 1 },
                    $set: { 'recipients.$.responded': true },
                    lastResponded: new Date()
                }).exec(); // executes the query
            })
            .value();
        res.send({})
    })

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