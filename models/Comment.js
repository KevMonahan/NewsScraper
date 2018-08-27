var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var commentSchema = new Schema({

  _chapterId: {
    type: Schema.Types.ObjectId,
    ref: "Chapter"
  },
  
  date: {
    type: Date,
    default: Date.now
  },  

  commentText: String
});

// Create the Note model using the noteSchema
var Comment = mongoose.model("Comment", commentSchema);

// Export the Note model
module.exports = Comment;
