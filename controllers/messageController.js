const Message = require("../models/Message");
const User = require("../models/User");

const { body, validationResult } = require("express-validator");

exports.all_messages_get = async function (req, res, next) {
  try {
    const allMessages = await Message.find()
      .populate("author")
      .sort({ timestamp: -1 })
      .exec();
    return res.render("index", {
      page: "Members Only",
      messages: allMessages,
    });
  } catch (error) {
    return next(error);
  }
};

exports.message_create_post = [
  body("title", "Message title is required")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage(" Title must be between 3 and 100 characters")
    .escape(),
  body("body", "Message body is required")
    .trim()
    .isLength({ min: 1, max: 600 })
    .withMessage("Message body must be between 1 and 600 characters")
    .escape(),
  async (req, res, next) => {
    const { title, body } = req.body;
    const { currentUser } = res.locals;
    const errors = validationResult(req);
    const newMessage = new Message({
      title,
      body,
      timestamp: new Date(),
      author: currentUser._id,
    });
    if (!errors.isEmpty()) {
      return res.render("createMessage", {
        page: "Write a Message",
        message: { title, body },
        errors: errors.array(),
      });
    } else {
      try {
        await newMessage.save();
        currentUser.messages.push(newMessage._id);
        await User.findByIdAndUpdate(currentUser._id, currentUser).exec();
        return res.redirect("/");
      } catch (error) {
        return next(error);
      }
    }
  },
];

exports.message_delete_post = async function (req, res, next) {
  const message = JSON.parse(req.body.message);
  if (res.locals.currentUser.isAdmin) {
    try {
      await Message.findByIdAndDelete(message._id).exec();
      const author = await User.findById(message.author)
        .populate("messages")
        .exec();
      const updatedMessages = author.messages.filter(
        (authorMessage) => authorMessage._id !== message._id
      );
      await User.findByIdAndUpdate(author._id, {
        messages: updatedMessages,
      }).exec();
      return res.redirect("/");
    } catch (error) {
      return next(error);
    }
  }
  res.redirect("/");
};
