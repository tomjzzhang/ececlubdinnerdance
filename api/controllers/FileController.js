/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
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

			console.log(uploadedFiles);

			fs = require('fs');
			
			console.log(uploadedFiles[0].fd);
			fs.readFile(uploadedFiles[0].fd, 'utf8', function (err,data) {
				if (err) {
					console.log(err);
				}
				var newUsers = CSVToArray(data);
				console.log(newUsers);

                /*
                var randtoken = require('rand-token');
                var userObjs = users.map(function extractEmails(item){
                    var randPass = randtoken.generate(10);
                    item.password = randPass;
                    item.confirmation = randPass;
                    return item;
                });
                EmailService.sendAccountInfo(userObjs);
                */

				var fileSubmissionSuccess = [{name: 'fileSubmission', message: 'File submitted successfully!'}]
				req.session.flash = {
					err: fileSubmissionSuccess
				}
				return res.redirect('/file/index');
			});
			
		});
	}
};

