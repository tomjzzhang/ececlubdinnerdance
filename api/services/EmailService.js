// EmailService.js - in api/services

var nodemailer = require('nodemailer');

var service = 'Gmail';
var auth = {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
}

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: service,
    auth: auth,
});

module.exports = {

    sendOneEmail: function(options, next) {
        if (!process.env.MAIL_USER || !process.env.MAIL_PASS){
            var serviceUnavailableError = new Error("Service is currently unavailable");
            console.log(serviceUnavailableError);
            console.log(serviceUnavailableError.stack);
            next(serviceUnavailableError);
        }

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