/**
 * RiddlesController
 *
 * @description :: Server-side logic for managing riddles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {



	'new_riddles' : function (req,res){
		res.view();
	},

	'RaffleCongrats' : function (req,res){
		res.view();
	},


	create: function (req, res, next){
	//check if user entered UTmail
	//.+@mail\.utoronto\.ca$ ->regexp to check
	var UTmail_pattern = new RegExp(".+@mail\.utoronto\.ca$");



	if(!UTmail_pattern.test(req.param('email'))){
		var emailError = [{name: 'UTmail is required', message: 'Email entered is not a UTmail. UTmail is required for the raffle! eg: xxx@mail.utoronto.ca'}]
		req.session.flash = {
			err: emailError
		}
		console.log("email is not a UTmail");
		res.redirect('/riddles/new_riddles');
		return;

	}

		//hard code riddles here
	if(req.param('ans_Riddle_1') != "qwerty"){
		var riddleError_1 = [{name: 'AnswerIsWrong', message: 'The answer to this riddle is incorrect.'}]
		req.session.flash = {
			err: riddleError_1
		}
		console.log("answer is wrong");
		res.redirect('/riddles/new_riddles');
		return;
	}

	/* Create a User with the params sent from
			the sign-up form -> new_riddles.ejs
	*/
	Riddles.create(req.params.all(), function riddlesCreated (err, riddles) {

		//if there's an error
		if(err)
			return next(err);

		//After successfully creating the user
		//redirect to the show action

		//for testing purposes
		//res.json(riddles);

		res.redirect('/riddles/RaffleCongrats');
		return;



		} );

	}


};
