
var db = require("../models");

module.exports = {
  // Find a comment
  find: function(req, res) {
    db.Chapter.find({ _chapterId: req.params.id }).then(function(dbComment) {
      res.json(dbComment);
    });
  },
  // Create a new note
  create: function(req, res) {
    db.Chapter.create(req.body).then(function(dbComment) {
      res.json(dbComment);
    });
  },
  // Delete a note with a given id
  delete: function(req, res) {
    db.Chapter.remove({ _id: req.params.id }).then(function(dbComment) {
      res.json(dbComment);
    });
  }
};
