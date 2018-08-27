var router = require("express").Router();
var chapterController = require("../../controllers/chapter");

router.get("/", chapterController.findAll);
router.delete("/:id", chapterController.delete);
router.put("/:id", chapterController.update);

module.exports = router;
