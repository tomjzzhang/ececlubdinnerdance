/**
 * SubmissionController
 *
 * @description :: Server-side logic for managing submissions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new': function(req, res) {
		var date = new Date();
		var criteria = { publishDate: { '<=': date }, expiryDate:{'>=': date}}
		Riddle.find(criteria, function foundRiddles (err, riddles){
			if (err) return next(err);
			
			res.view({
				layout: 'mainlayout',
				riddles: riddles
			})
		})
	},

	create: function (req, res, next) {
		//test if email is a mail.utoronto.ca
		var regex = new RegExp('.+@mail\.utoronto\.ca$');
		if (!regex.test(req.param('email'))){
			var invalidEmailError = [{name: 'invalidEmail', message: 'Invalid Email. Please use your U of T email.'}]
			req.session.flash={
				err: invalidEmailError
			}
			res.redirect('/submission/new/');
		}else{
			var date = new Date();
			var criteria = { publishDate: { '<=': date }, expiryDate:{'>=': date}}
			Riddle.find(criteria, function foundRiddles (err, riddles){
				if (err) return next(err);
				
				var correct = true;
				for (var i = 0; i < riddles.length && correct; i++){
					var answer = req.param(riddles[i].id);
					var acceptedAnswer = riddles[i].answer.split(',');
					var isAccepted = false;
					for (var j = 0; j < acceptedAnswer.length && !isAccepted; j++){
						if (acceptedAnswer[j].toUpperCase().trim() == answer.toUpperCase().trim()){
							isAccepted = true;
						}
					}

					if (!isAccepted){
						correct = false;
					}
				}

				if (correct != true){
					var incorrectAnswersError = [{name: 'incorrectAnswersError', message: 'Sorry! One or more of your answers is incorrect.'}]
					req.session.flash={
						err: incorrectAnswersError
					}
					res.redirect('/submission/new/');
				}else{
					Submission.create(req.params.all(), function riddleCreated(err, riddle){
						if (err) {
							console.log(err);
							req.session.flash={
								err: err.ValidationError
							}

							return res.redirect('/submission/new');
						}

						var submissionSuccess = [{name: 'submission', message: 'Congratulations you solved all the riddles this week! You have successfully been entered into a raffle.'}]
						req.session.flash={
							err: submissionSuccess
						}
						res.redirect('/submission/new/');
					});
				}
			})
		}
		
	},

	index: function(req, res, next){

		Submission.find(function foundSubmissions (err, submissions){
			if (err) return next(err);
			
			res.view({
				submissions: submissions
			})
		})
	},

	destroy: function (req, res, next){
		Submission.findOne(req.param('id'), function foundSubmission (err, submission){
			if (err) return next(err);

			if (!submission) return next('Submission doesn\'t exists.');

			Submission.destroy(req.param('id'), function submissionDestroyed(err){
				if (err) return next (err);
			});

			res.redirect('/submission/index');
		})
	},
	
};

