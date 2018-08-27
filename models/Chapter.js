var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var chapterSchema = new Schema({
    book: {
        type: String,
        required: true,
        unique: { index: { unique: true } }
    },
    chapter: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    saved: {
        type: Boolean,
        default: false
    }
    

});

var Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = Chapter;