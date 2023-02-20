const express = require("express");
const {
  fetchAllTopics,
  fetchAllArticles,
  fetchCommentsByArticleId,
} = require("./controllers/newsController");
const {
  handle500StatusCodes,
  handle400StatusCodes,
  handleCustomErrors,
} = require("./errorHandlingControllers/errorController");

const app = express();

app.get("/api/topics", fetchAllTopics);

app.get("/api/articles", fetchAllArticles);

app.get("/api/articles/:article_id/comments", fetchCommentsByArticleId);

app.use(handle400StatusCodes);
app.use(handleCustomErrors);
app.use(handle500StatusCodes);

module.exports = app;
