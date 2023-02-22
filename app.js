const express = require("express");
const {
  fetchAllTopics,
  fetchAllArticles,
  fetchCommentsByArticleId,
  fetchArticleById,
  patchArticleById,
  postCommentByArticleId,
  fetchAllUsers,
  fetchAllEndpoints,
} = require("./controllers/newsController");
const {
  handle500StatusCodes,
  handle400StatusCodes,
  handleCustomErrors,
  handle404StatusCodes,
} = require("./errorHandlingControllers/errorController");

const app = express();
app.use(express.json());

app
  .get("/api/users", fetchAllUsers)
  .get("/api/topics", fetchAllTopics)
  .get("/api/articles", fetchAllArticles)
  .get("/api/articles/:article_id", fetchArticleById)
  .get("/api/articles/:article_id/comments", fetchCommentsByArticleId)
  .patch("/api/articles/:article_id", patchArticleById)
  .post("/api/articles/:article_id/comments", postCommentByArticleId)
  .get("/api", fetchAllEndpoints);

app.use(handle400StatusCodes);
app.use(handle404StatusCodes);
app.use(handleCustomErrors);
app.use(handle500StatusCodes);

module.exports = app;
