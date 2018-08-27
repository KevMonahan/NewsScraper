var router = require("express").Router();
var db = require("../../models");

// home page
router.get("/", function(req, res) {
  db.Chapter.find({ saved: false })
    .sort({ date: -1 })
    .then(function(dbChapters) {
      res.render("home", { chapters: dbChapters });
    });
});

// saved chapters
router.get("/saved", function(req, res) {
  db.Chapter.find({ saved: true })
    .sort({ date: -1 })
    .then(function(dbChapters) {
      res.render("saved", { chapters: dbChapters });
    });
});

module.exports = router;
