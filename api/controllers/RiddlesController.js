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


	create: function (req, res, next){
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
		res.json(riddles);

		} );

	}


};
