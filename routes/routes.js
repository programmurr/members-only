var express = require("express");
var router = express.Router();
const passport = require("passport");
require("dotenv").config();

const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");

router.get("/", (req, res) => {
  res.render("index", { page: "Members Only", user: req.user });
});

// SIGN UP ROUTES
router.get("/sign-up", (req, res) => {
  res.render("signUp", { page: "Sign Up" });
});

router.post("/sign-up", userController.user_create_post);

// LOG IN ROUTES
router.get("/log-in", (req, res) => {
  res.render("logIn", { page: "Log In", message: req.flash("error") });
});

router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureFlash: true,
  })
);

router.get("/log-out", (req, res) => {
  req.logOut();
  res.redirect("/");
});

// JOIN UP ROUTES
router.get("/join-club", (req, res, next) => {
  try {
    if (res.locals.currentUser.memberStatus) {
      res.redirect("/");
    } else {
      res.render("joinClub", { page: "Join the Club" });
    }
  } catch (error) {
    return next(error);
  }
});

router.post("/join-club", userController.user_update_membership_post);

// CREATE MESSAGE ROUTES
router.get("/create-message", (req, res) => {
  res.render("createMessage", { page: "Write a Message" });
});

router.post("/create-message", messageController.message_create_post);

module.exports = router;
