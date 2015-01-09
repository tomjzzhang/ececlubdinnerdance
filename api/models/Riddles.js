/**
* Riddles.js
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

    ans_Riddle_1: {
      type: 'string',
      required: true
    },




  },

  toJSON: function() {
    var obj = this.toObject();
    delete obj.ans_Riddle_1;
  }

};
