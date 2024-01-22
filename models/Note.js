// Note.js

const mongoose = require('mongoose');


const NoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    
    description: {
        type: String,
        unique: true,
        // sparse: true, // Allow multiple null values
        required: false, // Marking as not required to handle null values
    },
    date: {
        type: Date,
        default: Date.now
    },
    tag: {
        type: String,
        default: "General"
    }
});

// Allow multiple null values for 'description' in the unique index
NoteSchema.index({ description: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('NoteData', NoteSchema);
