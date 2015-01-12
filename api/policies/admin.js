module.exports = function(req, res, ok){
	if (!req.session || (typeof req.session.User == 'undefined')){	
		var requireLoginError = [{name: 'requireLogin', message: 'You must be signed in to access this page'}]
		req.session.flash = {
			err: requireLoginError
		}
		res.redirect('/session/new');
		return;
	}

	var isAdmin = req.session.User.admin;

	if (!isAdmin ){
		var noRightsError = [{name: "noRights", message: "You must be an admin."}]
		req.session.flash = {
			err: noRightsError
		}
		res.redirect('/session/new');
		return;
	}

	ok();
}