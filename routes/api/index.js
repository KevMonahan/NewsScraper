var router = require("express").Router();
var fetchRoutes = require("./fetch");
var commentRoutes = require("./comments");
var chapterRoutes = require("./chapters");
var clearRoutes = require("./clear");

router.use("/fetch", fetchRoutes);
router.use("/comments", commentRoutes);
router.use("/chapters", chapterRoutes);
router.use("/clear", clearRoutes);

module.exports = router;
