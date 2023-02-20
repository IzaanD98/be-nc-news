const express = require("express");
const { fetchAllTopics } = require("./controllers/newsController");
const {
  handle500StatusCodes,
} = require("./errorHandlingControllers/errorController");

const app = express();

app.get("/api/topics", fetchAllTopics);

app.use(handle500StatusCodes);

module.exports = app;
