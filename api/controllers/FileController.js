/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
//var csv is the CSV file with headers
function csvToArray(csv){
    csv = csv.replace(/(\r)/gm,"");
    var lines=csv.split("\n");

    var result = [];

    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split(",");
        if (currentline.length == headers.length){
            for(var j=0;j<headers.length;j++){
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);
        }
    }

    return result;
}

module.exports = {
	'index' : function(req, res){
		res.view();
	},

	'upload' : function(req, res){
		if(req.method === 'GET')
			return res.json({'status':'GET not allowed'});						
			//	Call to /upload via GET is error

		req.file('csv').upload(function (err, uploadedFiles) {
			if (err) return res.send(500, err);

			fs = require('fs');
			fs.readFile(uploadedFiles[0].fd, 'utf8', function (err,data) {
				if (err) {
					console.log(err);
                    var fileReadError = [{name: 'fileRead', message: 'Error reading file!'}]
                    req.session.flash={
                        err: fileReadError
                    }
                    return res.redirect('/file/index');
				}

				var users = csvToArray(data);

                var usersCreated = 0;

                var randtoken = require('rand-token');
                var userObjs = users.map(function generatePasswords(item){
                    var randPass = randtoken.generate(10);
                    item.password = randPass;
                    item.confirmation = randPass;

                    User.create(item, function userCreated(err, user){
                        if (err) {
                            console.log('The following user was unable to be created:');
                            console.log(item);
                            console.log(err);
                        }

                        var signinLink = 'http://' + req.get('host') + '/session/new';
                        // NB! No need to recreate the transporter object. You can use
                        // the same transporter object for all e-mails
                        var text =  'Hi' + user.name + '\n'
                                    'Thank you for registering for ECE dinnerdance! Your account has been created with the following credentials: \n' +
                                    'Ticket Number:  ' + user.ticketNumber + '\n Password: ' + item.password + '\n \n' +
                                    'Please sign in with these credentials at ' + signinLink + 'and change your password as soon as possible. '+
                                    'If you have signed up on someone\'s behalf, please forward them this information.';

                        var html = '<p>Hi ' +  user.name + ' </p>'+
                                    '<p>Thank you for registering for ECE dinnerdance! Your account has been created with the following credentials: </p>'+
                                    '<div><strong>Ticket Number: </strong>' + user.ticketNumber + '<br><strong>Password: </strong>' + item.password + '</div>' +
                                    '<p>Please sign in with these credentials at <a href="'+ signinLink + '" target="_blank">' + signinLink + '</a> '+
                                    'and change your password as soon as possible. If you have signed up on someone\'s behalf, please forward them this information.</p>';

                        var emailOptions = {
                            email: user.email,
                            subject: 'Welcome to ECE Dinnerdance',
                            html: html,
                            text: text
                        }

                        EmailService.sendOneEmail(emailOptions, function emailSent(err){
                            if(err){
                                console.log(err);
                                req.session.flash={
                                    err: err
                                }
                            }else{
                                var accountCreationSuccess = [{name: 'accountCreation', message: 'Account successfully created! Check your email for further instructions.'}]
                                req.session.flash={
                                    err: accountCreationSuccess
                                }
                            }
                            return res.redirect('/user/register');
                        });


                        usersCreated++;
                    });

                    return item;
                });
                /*
                console.log(userObjs);

                EmailService.sendAccountInfo(req, userObjs, function emailSent(err){
                    if(err){
                        console.log(err);
                        req.session.flash={
                            err: err
                        }
                    }else{
                        var accountCreationSuccess = [{name: 'accountCreation', message: 'Account successfully created! Check your email for further instructions.'}]
                        req.session.flash={
                            err: accountCreationSuccess
                        }
                    }
                    return res.redirect('/file/index');
                });
                */
			});
			
		});
	}
};

