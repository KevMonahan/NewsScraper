var db = require("../models")

module.exports = {
    // Find all Chapters, date sorted descendingly, then output.
    findAll: function(req, res) {
      db.Chapter
        .find(req.query)
        .sort({ date: -1 })
        .then(function(dbChapter) {
          res.json(dbChapter);
        });
    },

    delete: function(req, res) {
      db.Chapter.remove({ _id: req.params.id }).then(function(dbChapter) {
        res.json(dbChapter);
      });
    },

    update: function(req, res) {
      db.Chapter.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true }).then(function(dbChapter) {
        res.json(dbChapter);
      });
    }
  };
  