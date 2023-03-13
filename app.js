const express = require("express");
const cors = require("cors");
const {
  handle500StatusCodes,
  handle400StatusCodes,
  handleCustomErrors,
  handle404StatusCodes,
} = require("./errorHandlingControllers/errorController");
const apiRouter = require("./routes/api-router");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.use(handle400StatusCodes);
app.use(handle404StatusCodes);
app.use(handleCustomErrors);
app.use(handle500StatusCodes);

module.exports = app;
