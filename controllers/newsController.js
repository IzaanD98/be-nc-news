const {
  getAllTopics,
  getAllArticles,
  getCommentsByArticleId,
  getArticleById,
} = require("../models/newsModel");

exports.fetchAllTopics = (request, response, next) => {
  getAllTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((error) => {
      next(error);
    });
};

exports.fetchAllArticles = (request, response, next) => {
  getAllArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};

exports.fetchCommentsByArticleId = (request, response, next) => {
  const id = request.params.article_id;
  getCommentsByArticleId(id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};

exports.fetchArticleById = (request, response, next) => {
  const id = request.params.article_id;
  getArticleById(id)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};