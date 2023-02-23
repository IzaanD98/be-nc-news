const {
  fetchAllUsers,
  fetchUserByUsername,
} = require("../controllers/newsController");

const usersRouter = require("express").Router();

usersRouter.route("/").get(fetchAllUsers);

usersRouter.route("/:username").get(fetchUserByUsername);

module.exports = usersRouter;
