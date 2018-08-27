var db = require("../models");

var scrape = require("../scripts/scrape");

module.exports = {
    scrapeHeadlines: function(req, res) {
      // scrape the NYT
      return scrape()
        .then(function(articles) {
          // then insert articles into the db
          return db.Chapter.create(articles);
        })
        .then(function(dbChapter) {
          if (dbChapter.length === 0) {
            res.json({
              message: "No new articles today. Check back tomorrow!"
            });
          }
          else {
            res.json({
              message: "Added " + dbChapter.length + " new articles!"
            });
          }
        })
        .catch(function(err) {
          res.json({
            message: "Scrape complete!!"
          });
        });
    }
  };
  