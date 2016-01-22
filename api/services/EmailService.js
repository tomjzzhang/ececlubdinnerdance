// EmailService.js - in api/services

var sendgrid = require("sendgrid")(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

module.exports = {

    sendOneEmail: function(options, next) {
        var mailOptions = {
            from: 'ececlub@ecf.utoronto.ca', // sender address
            to: options.email, // list of receivers
            subject: options.subject, // Subject line
            text: options.text, // plaintext body
            html: options.html, // html body
        };

        sendgrid.send(mailOptions, function(error, json){
            if(error){
                console.log(error);
                console.log(error.stack);
                var emailFailedError = [{name: 'emailFailedError', message: 'Email Service Failed'}]
                return next(emailFailedError);
            }else{
                console.log(json);
                return next();
            }
        });

    },

    sendAccountInfo: function(req, users, next){
        var smtpapi = require('smtpapi');
        var header = new smtpapi();

        var ticketNumbers = users.map(function extractTicketNumber(item){
            return item.ticketNumber;
        });

        var emails = users.map(function extractEmails(item){
            return item.email;
        });

        var passwords = users.map(function extractEmails(item){
            if (!item.password){
                console.log("password has not been set");
            }
            return item.password;
        });

        var names = users.map(function extractEmails(item){
            return item.name;
        });

        var smtpapi = require('smtpapi');
        var header = new smtpapi();

        var substitutions = {
            '%account%': ticketNumbers, 
            '%password%' : passwords,
            '%name%' : names,
        }
        header.setSubstitutions(substitutions);
        header.setTos(emails);

        var signinLink = 'http://' + req.get('host') + '/session/new';

        var html = '<p>Hi %name%</p>'+
                    '<p>Thank you for registering for ECE dinnerdance! Your account has been created with the following credentials: </p>'+
                    '<div><strong>Ticket Number: </strong>%account%<br><strong>Password: </strong>%password%</div>' +
                    '<p>Please sign in with these credentials at <a href="'+ signinLink + '" target="_blank">' + signinLink + '</a> '+
                    'and change your password as soon as possible. If you have signed up on someone\'s behalf, please forward them this information.</p>';

        var mailOptions = {
            from: 'dinnerdance@ece.skule.ca', // sender address
            to: 'ececlub@ecf.utoronto.ca', // list of receivers
            subject: 'Welcome to ECE Dinnerdance', // Subject line
            html: html, // html body
            smtpapi: header
        };

        sendgrid.send(mailOptions, function(error, json){
            if(error){
                console.log(error);
                console.log(error.stack);
                var emailFailedError = [{name: 'emailFailedError', message: 'Email Service Failed'}]
                return next(emailFailedError);
            }else{
                console.log(json);
                return next();
            }
        });

    },

    sendReminder: function(req, users, next){
        var smtpapi = require('smtpapi');
        var header = new smtpapi();

        var emails = users.map(function extractEmails(item){
            return item.email;
        });

        header.setTos(emails);
        
        var link = 'http://' + req.get('host') + '/password/reset';
        var html = '<p>Hi there!</p>'+
                    '<p>We noticed that you have not picked a table for the ECE dinner dance. Please do so by Tuesday, February 10th, 2015 at 9pm. '+
                    'If you have not selected a table by then, one will be randomly selected for you.</p>'+
                    '<p>Yours Truly,</p>' + 
                    '<p>ECE Club</p>';

        var mailOptions = {
            from: 'ececlub@ecf.utoronto.ca', // sender address
            to: 'ececlub@ecf.utoronto.ca', // list of receivers
            subject: 'Reminder: Pick your table!', // Subject line
            html: html, // html body
            smtpapi: header
        };

        sendgrid.send(mailOptions, function(error, json){
            if(error){
                console.log(error);
                console.log(error.stack);
                var emailFailedError = [{name: 'emailFailedError', message: 'Email Service Failed'}]
                return next(emailFailedError);
            }else{
                console.log(json);
                return next();
            }
        });

    },

    sendToAll: function(subject, html, next){
        User.find(function foundUsers(err, users){
            if (err) return next(err);
            var smtpapi = require('smtpapi');
            var header = new smtpapi();

            var emails = users.map(function extractEmails(item){
                return item.email;
            });

            header.setTos(emails);
            
            var mailOptions = {
                from: 'dinnerdance@ece.skule.ca', // sender address
                to: 'ececlub@ecf.utoronto.ca', // list of receivers
                subject: subject, // Subject line
                html: html, // html body
                smtpapi: header
            };

            sendgrid.send(mailOptions, function(error, json){
                if(error){
                    console.log(error);
                    console.log(error.stack);
                    var emailFailedError = [{name: 'emailFailedError', message: 'Email Service Failed'}]
                    return next(emailFailedError);
                }else{
                    console.log(json);
                    return next();
                }
            });
        })
    }
};