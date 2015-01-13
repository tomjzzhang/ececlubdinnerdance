// EmailService.js - in api/services

var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: sails.config.mailer.service,
    auth: sails.config.mailer.auth,
});

module.exports = {

    sendOneEmail: function(options, next) {
        if (!options.email || !options.subject){
            var noEmailError = new Error("Email and Subject Required");
            console.log(noEmailError);
            console.log(noEmailError.stack);
            next(noEmailError);
        }

        var mailOptions = {
            from: 'ECE Club <dinnerdance@ece.skule.ca>', // sender address
            to: options.email, // list of receivers
            subject: options.subject, // Subject line
            text: options.text, // plaintext body
            html: options.html // html body
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
                console.log(error.stack);
                return next(error);
            }else{
                console.log('Message sent: ' + info.response);
                return next();
            }
        });

    }
};