/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,

  attributes: {
  	
    firstName: {
  		type: 'string',
  		required: true
  	},

    lastName: {
      type: 'string',
      required: true
    },

    email: {
      type: 'string',
      email: true,
      required: true,
      unique: true
    },

    ticketNumber: {
      type: 'string',
      required: true,
      unique: true
    },

    /*

    year: {
      type: 'string',
      required: true
    },

    foodOption: {
      type: 'string',
      required: true
    },

    tableName: {
      type: 'string',
      required: true
    },

    age: {
      type: 'string',
      required: true
    },

    allergies: {
      type: 'string',
    },

    busDepartTime: {
      type: 'string',
      required: true
    },

    busLeaveTime: {
      type: 'string',
      required: true
    },

    */

  	encryptedPassword:{
  		type: 'string'
  	},


  },

  toJSON: function() {
    var obj = this.toObject();
    delete obj.password;
    delete obj.confirmation;
    delete obj.encryptedPassword;
    delete obj._csrf;
    return obj;
  },

  beforeCreate: function(values, next) {

    // condition to check if user's password is valid
    // or password and password confirmation are identical
    if(!values.password || values.password != values.confirmation) {
      return next({err: ["Password doesn't match password confirmation"]});
    }

    var bcrypt = require('bcryptjs');
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(values.password, salt, function(err, hash) {
            // Store hash in your password DB.
            if (err) return next(err);
            values.encryptedPassword = hash;
            next();
        });
    });
  }
};
