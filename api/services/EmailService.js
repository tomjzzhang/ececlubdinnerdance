// EmailService.js - in api/services

var sendgrid = require("sendgrid")(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

module.exports = {

    sendOneEmail: function(options, next) {
        var smtpapi    = require('smtpapi');
        var header = new smtpapi();

        header.addSubstitution('account', ['secret']);
        
        var mailOptions = {
            from: 'dinnerdance@ece.skule.ca', // sender address
            to: options.email, // list of receivers
            subject: options.subject, // Subject line
            text: options.text, // plaintext body
            html: options.html, // html body
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

    sendAccountInfo: function(users, next){
        var smtpapi = require('smtpapi');
        var header = new smtpapi();

        var ticketNumbers = users.map(function extractTicketNumber(item){
            return item.ticketNumber;
        });

        var emails = users.map(function extractEmails(item){
            return item.email;
        });

        var passwords = users.map(function extractEmails(item){
            return item.password;
        });

        console.log("ticket #s");
        console.log(ticketNumbers);
        console.log("emails");
        console.log(emails);
        console.log("passwords");
        console.log(passwords);

    }
};