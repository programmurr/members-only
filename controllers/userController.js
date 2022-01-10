const User = require("../models/User");

const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

function passwordsMatch(value, { req }) {
  if (value !== req.body.password) {
    throw new Error("Passwords do not match");
  }
  return true;
}

exports.user_create_post = [
  body("firstName", "First Name required")
    .trim()
    .isLength({ min: 3, max: 24 })
    .withMessage("First Name must be between 3 and 24 characters")
    .escape(),
  body("lastName")
    .trim()
    .isLength({ min: 3, max: 24 })
    .withMessage("Last Name must be between 3 and 24 characters")
    .escape(),
  body("userName", "Email address is required").isEmail().normalizeEmail(),
  body("password")
    .isLength({ min: 12, max: 50 })
    .withMessage("Password must be between 12 and 50 characters")
    .matches(/\d/)
    .withMessage("Password must contain one number"),
  body("confirmPassword").custom(passwordsMatch),
  async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (hashError, hashedPassword) => {
      if (hashError) {
        return next(hashError);
      }
      const errors = validationResult(req);
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: hashedPassword,
        memberStatus: false,
        messages: [],
      });
      if (!errors.isEmpty()) {
        return res.render("signUp", { user, errors: errors.array() });
      } else {
        try {
          const foundUser = await User.findOne({
            userName: req.body.userName,
          }).exec();
          if (foundUser) {
            return res.render("signUp", {
              errors: [{ msg: "User already exists" }],
            });
          } else {
            await user.save();
            return res.redirect("/");
          }
        } catch (error) {
          return next(error);
        }
      }
    });
  },
];

exports.user_update_membership_post = async function (req, res, next) {
  if (req.body.clubPassword === process.env.MEMBER_PASSWORD) {
    const { _id, firstName, lastName, userName, password, messages } =
      res.locals.currentUser;
    try {
      const updatedUser = new User({
        _id,
        firstName,
        lastName,
        userName,
        password,
        memberStatus: true,
        messages,
      });
      await User.findByIdAndUpdate(_id, updatedUser, {}).exec();
      res.redirect("/");
    } catch (error) {
      return next(error);
    }
  } else {
    res.render("joinClub", {
      page: "Join the Club",
      errors: [{ msg: "Incorrect membership password" }],
    });
  }
};
