var express = require("express");
var router = express.Router();
const passport = require("passport");

const userController = require("../controllers/userController");

router.get("/", function (req, res) {
  res.render("index", { page: "Members Only", user: req.user });
});

router.get("/sign-up", function (req, res) {
  res.render("signUp", { page: "Sign Up" });
});

router.post("/sign-up", userController.user_create_post);

router.get("/log-in", function (req, res) {
  res.render("logIn", { page: "Log In" });
});

router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })
);

router.get("/log-out", (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
