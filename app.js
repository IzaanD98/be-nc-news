const express = require("express");
const {
  fetchAllTopics,
  fetchAllArticles,
  fetchCommentsByArticleId,
  fetchArticleById,
  patchArticleById,
} = require("./controllers/newsController");
const {
  handle500StatusCodes,
  handle400StatusCodes,
  handleCustomErrors,
} = require("./errorHandlingControllers/errorController");

const app = express();
app.use(express.json());
app
  .get("/api/topics", fetchAllTopics)
  .get("/api/articles", fetchAllArticles)
  .get("/api/articles/:article_id", fetchArticleById)
  .get("/api/articles/:article_id/comments", fetchCommentsByArticleId)
  .patch("/api/articles/:article_id", patchArticleById);

app.use(handle400StatusCodes);
app.use(handleCustomErrors);
app.use(handle500StatusCodes);

module.exports = app;
