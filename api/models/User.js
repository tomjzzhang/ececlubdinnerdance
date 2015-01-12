/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,

  attributes: {

    name: {
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
      type: 'integer',
      required: true,
      unique: true
    },

    ticketType:{
      type: 'string',
      defaultsTo: 'Drinking',
    },
    
    //add in year, foodoption, tablename ,age allergies, busDepartTime , bus leave 
    year: {
      type: 'string',
    },

    dietaryRestrictions: {
      type: 'string',
      defaultsTo: 'None',
    },

    tableNum: {
      type: 'integer',
    },

    overDrinkingAge: {
      type: 'boolean',
    },

    allergies: {
      type: 'string',
    },

    busDepartTime: {
      type: 'string',
    },

    busLeaveTime: {
      type: 'string',
    },

    //TODO add min length
  	encryptedPassword:{
  		type: 'string',
  	},

    admin : {
      type: 'boolean',
      defaultsTo: false
    }
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
