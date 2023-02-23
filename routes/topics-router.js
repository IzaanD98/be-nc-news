const { fetchAllTopics } = require("../controllers/newsController");

const topicsRouter = require("express").Router();

topicsRouter.route("/").get(fetchAllTopics);

module.exports = topicsRouter;
