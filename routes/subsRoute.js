const express = require("express");
const router = express.Router();

const { saveSubscription, deleteSubscription} = require("../controllers/subsController.js")

router.route("/save").post(saveSubscription)
router.route("/delete").delete(deleteSubscription)
module.exports = router