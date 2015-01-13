// EmailService.js - in api/services

var nodemailer = require('nodemailer');

var service = 'Gmail';
var auth = {
    user: '',
    pass: ''
}

if (!sails.config.mailer){
    console.log("Please configure mailer object in local.js");
    console.log("ex. mailer: { \n " +
            "service: 'Gmail', \n" +
            "auth: { \n" +
            "  user: <username>, \n" +
            "  pass: <password> \n" +
            "}, \n" +
            "defaultFromAddress: 'ECE Club <dinnerdance@ece.skule.ca>' \n" +
          "}");
}else{
    if (!sails.config.mailer.auth){
        console.log('mailer.auth required');
    }else{
        auth = sails.config.mailer.auth;
    }

    if (sails.config.mailer.service){
        service = sails.config.mailer.service;
    }
}

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: service,
    auth: auth,
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