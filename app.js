const express = require("express");
const {
  fetchAllTopics,
  fetchAllArticles,
  fetchArticleById,
} = require("./controllers/newsController");
const {
  handle500StatusCodes,
  handle400StatusCodes,
} = require("./errorHandlingControllers/errorController");

const app = express();

app.get("/api/topics", fetchAllTopics);

app.get("/api/articles", fetchAllArticles);

app.get("/api/articles/:article_id", fetchArticleById);

app.use(handle400StatusCodes);
app.use(handle500StatusCodes);

module.exports = app;
