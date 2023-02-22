exports.handle400StatusCodes = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ message: "Bad Request" });
  } else if (error.code === "23502") {
    response.status(400).send({ message: "Bad Request" });
  } else {
    next(error);
  }
};

exports.handle404StatusCodes = (error, request, response, next) => {
  if (error.code === "23503") {
    response.status(404).send({ message: "Not Found" });
  } else {
    next(error);
  }
};

exports.handleCustomErrors = (error, request, response, next) => {
  if (error.status && error.message) {
    response.status(error.status).send({ message: error.message });
  } else {
    next(error);
  }
};

exports.handle500StatusCodes = (error, request, response, next) => {
  console.log(error);
  response.status(500).send({ message: "Internal Server Error" });
};
