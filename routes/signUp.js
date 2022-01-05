const User = require("../models/User");

exports.signUp_get = function (req, res, next) {
  res.render("signUp", { page: "Sign Up" });
};
