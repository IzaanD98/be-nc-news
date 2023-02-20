exports.handle400StatusCodes = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send("Bad Request");
  } else {
    next(error);
  }
};

exports.handleCustomErrors = (error, request, response, next) => {
  if (error.status && error.message) {
    response.status(error.status).send(error.message);
  } else {
    next(error);
  }
};

exports.handle500StatusCodes = (error, request, response, next) => {
  console.log(error);
  response.status(500).send("Internal Server Error");
};
