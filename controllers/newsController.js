const {
  getAllTopics,
  getAllArticles,
  getCommentsByArticleId,
  getArticleById,
  updateArticleById,
  addCommentByArticleId,
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

exports.patchArticleById = (request, response, next) => {
  const id = request.params.article_id;
  const { inc_votes } = request.body;
  console.log(inc_votes, id);
  updateArticleById(id, inc_votes)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

exports.fetchCommentsByArticleId = (request, response, next) => {
  const id = request.params.article_id;
  const promise1 = getCommentsByArticleId(id);
  const promise2 = getArticleById(id);

  Promise.all([promise1, promise2])
    .then(([comments]) => {
      response.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postCommentByArticleId = (request, response, next) => {
  const id = request.params.article_id;
  const comment = request.body;
  addCommentByArticleId(id, comment)
    .then((newItem) => {
      response.status(201).send({ newItem });
    })
    .catch((error) => {
      next(error);
    });
};
