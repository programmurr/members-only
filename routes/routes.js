var express = require("express");
var router = express.Router();

const index = require("./index");
const signUp = require("./signUp");

router.get("/", index.home);
router.get("/sign-up", signUp.signUp_get);

module.exports = router;
