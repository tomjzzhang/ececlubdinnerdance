/**
* Bus.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,

  attributes: {
  	date: { 
  		type: 'datetime',
  	},

  	seats: {
  		type: 'integer',
  		defaultsTo: 48
  	},

  	type: {
  		type: 'string',
  		defaultsTo: 'leaving',
  	}
  },

  beforeCreate: function(values, next) {
  	if (typeof values.departDate == undefined || values.departDate == ''){
  		values.departDate = '2015-02-13';
  	}
  	var dateString = values.departDate + ' ' + values.departTime;
  	values.date = new Date(dateString.replace(/-/g, "/"));
  	next();
  }
};

