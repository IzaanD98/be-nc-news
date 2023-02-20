exports.handle500StatusCodes = (error, request, response, next) => {
  console.log(error);
  response.status(500).send("Internal Server Error");
};
