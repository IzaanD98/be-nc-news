const { fetchAllUsers } = require("../controllers/newsController");

const usersRouter = require("express").Router();

usersRouter.route("/").get(fetchAllUsers);

module.exports = usersRouter;
