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

    busDepartTime: {
      type: 'string',
      defaultsTo: '',
    },

    busReturnTime: {
      type: 'string',
      defaultsTo: '',
    },

  	encryptedPassword:{
  		type: 'string',
  	},

    passwordResetLink: {
      type: 'string',
      unique: true
    },

    admin : {
      type: 'boolean',
      defaultsTo: false
    },

    activated: {
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
    if(values.email != values.emailConfirm) {
      return next({err: ["Email doesn't match email confirmation"]});
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
  },

  /*
  beforeUpdate: function(values, next){
    
    var maxSeats = 1;
    var done1 = false;
    var done2 = false;

    if (typeof values.busDepartTime != undefined && values.busDepartTime != ''){
      var criteria = {
        busDepartTime: values.busDepartTime
      }

      User.find(criteria, function (err, users){
        if (err){
          return next(err);
        }else{
          var numSeats = users.length;
          var remainingSeats = maxSeats - numSeats;
          if (remainingSeats > 0){
            var busObj = {
              seats: remainingSeats
            }
            
            Bus.update(values.busDepartTime, busObj, function(err){
              if (err) console.log();
            });

            done1 = true;
            if (done1 && done2){
              return next();
            }
          }else{
            var busObj = {
              seats: remainingSeats
            }
            
            Bus.update(values.busDepartTime, busObj, function(err){
              if (err) console.log();
            });

            delete values.busDepartTime;
            done1 = true;
            if (done1 && done2){
              return next({ValidationError: [{message:"You have selected a full bus!"}]});
            }
          }
        } 
      });
    }else{
      done1 = true;
      if (done1 && done2){
        return next();
      }
    }

    if (typeof values.busReturnTime != undefined && values.busReturnTime != ''){
      var criteria = {
        busReturnTime: values.busReturnTime
      }

      User.find(criteria, function (err, users){
        if (err){
          return next(err);
        }else{
          var numSeats = users.length;
          var remainingSeats = maxSeats - numSeats;
          if (remainingSeats > 0){
            var busObj = {
              seats: remainingSeats
            }
            Bus.update(values.busReturnTime, busObj, function(err){
              if (err) console.log();
            });

            done2 = true;
            if (done1 && done2){
              return next();
            }
          }else{
            var busObj = {
              seats: remainingSeats
            }
            Bus.update(values.busReturnTime, busObj, function(err){
              if (err) console.log();
            });

            delete values.busReturnTime;
            done2 = true;
            if (done1 && done2){
              return next({ValidationError: [{message:"You have selected a full bus!"}]});
            }
          }
        } 
      });
    }else{
      done2 = true;
      if (done1 && done2){
        return next();
      }
    }

  }*/
};
