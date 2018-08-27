var db = require("../models");

var scrape = require("../scripts/scrape");

module.exports = {
  scrapeHeadlines: function (req, res) {
    console.log("has been hit !!");
    // scrape the NYT
    return scrape()
      .then(function (chapters) {
        // then insert articles into the db
        console.log(chapters);
        return db.Chapter.create(chapters);

      })
      .then(function (dbChapter) {
        console.log("~~~~~~~~~~~~~~~ \n" + dbChapter.length)

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
      .catch(function (err) {
        res.json({
          message: "Scrape complete!!"
        });
      });
  }
};
