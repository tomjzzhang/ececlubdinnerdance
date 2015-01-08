module.exports = function(req, res, ok){
	if (!req.session){	
		var requireLoginError = [{name: 'requireLogin', message: 'You must be signed in to access this page'}]
		req.session.flash = {
			err: requireLoginError
		}
		res.redirect('/session/new');
		return;
	}

	//console.log("Session User ID: " + typeof req.session.User.id);
	//console.log("Request Parameter ID: " + typeof req.param('id'));
	var sessionUserMatchesId = req.session.User.id == req.param('id');
	var isAdmin = req.session.User.admin;

	if (!sessionUserMatchesId && !isAdmin ){
		var noRightsError = [{name: "noRights", message: "You must be an admin."}]
		req.session.flash = {
			err: noRightsError
		}
		res.redirect('/session/new');
		return;
	}

	ok();
}