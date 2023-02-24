const { fetchAllTopics, postTopic } = require("../controllers/newsController");

const topicsRouter = require("express").Router();

topicsRouter.route("/").get(fetchAllTopics).post(postTopic);

module.exports = topicsRouter;
