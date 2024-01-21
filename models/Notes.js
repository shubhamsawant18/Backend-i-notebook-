const mongoose = require('mongoose');

const NotesSchema = new Schema({
    name:{
        type: String,
        required: true
    },
   desciption:{
        type: String,
        required: true,
        unique: true,
   },
    date:{
        type:Date,
        default:Date.now
    },
    tag:{
        type:String,
        default:"General"
       
    }
    
  });
  module.exports = mongoose.model('Notes',NotesSchema);