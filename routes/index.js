exports.home = function (req, res) {
  res.render("index", { page: "Members Only" });
};
