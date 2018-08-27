var axios = require("axios");
var cheerio = require("cheerio");


var scrape = function () {
    return axios.get("http://www.wuxiaworld.com").then(function (res) {
        var $ = cheerio.load(res.data);

        var results = [];

        $("table tr").each(function (i, element) {

            var bookTitle = $(element).children("td").eq(0).text().trim();
            var chapter = $(element).children("td").eq(1).text().trim();
            var translator = $(element).children("td").eq(2).text().trim();

            if (bookTitle && chapter && translator) {
                results.push({
                    bookTitle: bookTitle,
                    chapter: chapter,
                    translator: translator
                });
            }
        });
        return results;

    })
}

module.exports = scrape;