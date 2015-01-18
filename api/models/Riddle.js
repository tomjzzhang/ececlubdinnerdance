/**
* Riddle.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,

  attributes: {
  	riddle: {
		type: 'string',
		required: true
	},

	//comma seperated list of accepted answers
	answer: {
		type: 'string',
		required: true
	},

	publishDate: {
		type: 'date',
		required: true
	},

	expiryDate: {
		type: 'date',
		required: true
	},
  },

  toJSON: function() {
    var obj = this.toObject();
   	delete obj.answer;
  },
};
