// EmailService.js - in api/services

var sendgrid = require("sendgrid")(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

module.exports = {

    sendOneEmail: function(options, next) {
        var smtpapi    = require('smtpapi');
        var header = new smtpapi();

        header.addSubstitions('account', ['secret']);
        // Add the smtpapi header to the general headers
        var headers    = { 'x-smtpapi': header.jsonString() };

        var mailOptions = {
            from: 'dinnerdance@ece.skule.ca', // sender address
            to: options.email, // list of receivers
            subject: options.subject, // Subject line
            text: options.text, // plaintext body
            html: options.html, // html body
            headers: headers
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

    sendAccountInfo: function(users, next){
        var smtpapi    = require('smtpapi');
        var header = new smtpapi();

        var ticketNumbers = users.map(function extractName(item)){
            return item.ticketNumber;
        }

        var emails = users.map(function extractName(item)){
            return item.email;
        }

        var passwords = users.map(function extractName(item){
            return item.password;
        });
    }
};