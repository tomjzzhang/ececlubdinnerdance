// EmailService.js - in api/services

var sendgrid = require("sendgrid")(process.env.SENDGRID_USERNAME, process.env.PASSWORD);

module.exports = {

    sendOneEmail: function(options, next) {
        var mailOptions = {
            from: 'ECE Club <dinnerdance@ece.skule.ca>', // sender address
            to: options.email, // list of receivers
            subject: options.subject, // Subject line
            text: options.text, // plaintext body
            html: options.html // html body
        };

        sendgrid.send(mailOptions, function(error, json){
            if(error){
                console.log(error);
                console.log(error.stack);
                return next(error);
            }else{
                console.log(json);
                return next();
            }
        });

    }
};