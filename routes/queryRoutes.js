const dataQueryController = require("../controllers/dataQueryController");
const userController = require("../controllers/userController");
const express = require("express");
const router = express.Router();

router.route("/query").post(userController.protect, dataQueryController.query);
router
  .route("/validate")
  .post(userController.protect, dataQueryController.isValid);
router.post("/explain", userController.protect, dataQueryController.explain);

module.exports = router;
