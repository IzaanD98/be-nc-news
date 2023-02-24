const {
  getAllTopics,
  getAllArticles,
  getCommentsByArticleId,
  getArticleById,
  updateArticleById,
  addCommentByArticleId,
  getQueriedArticles,
  getAllUsers,
  removeCommentByCommentId,
  getUserByUsername,
  updateCommentByCommentId,
  addArticle,
  addTopic,
  removeArticleByArticleId,
} = require("../models/newsModel");

const endpoint = require("../endpoints.json");

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
  const { topic, sort_by, order, limit, p } = request.query;
  if (topic || sort_by || order || limit || p) {
    getQueriedArticles(topic, sort_by, order, limit, p)
      .then((articles) => {
        response.status(200).send({ articles });
      })
      .catch((error) => {
        next(error);
      });
  } else {
    getAllArticles()
      .then((articles) => {
        response.status(200).send({ articles });
      })
      .catch((error) => {
        next(error);
      });
  }
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
  const { limit, p } = request.query;
  const promise1 = getCommentsByArticleId(id, limit, p);
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

exports.fetchAllUsers = (request, response, next) => {
  getAllUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
};

exports.deleteCommentByCommentId = (request, response, next) => {
  const id = request.params.comment_id;
  removeCommentByCommentId(id)
    .then(() => {
      response.status(204).send({});
    })
    .catch((error) => {
      next(error);
    });
};

exports.fetchAllEndpoints = (request, response, next) => {
  response.status(200).send({ endpoint });
};

exports.fetchUserByUsername = (request, response, next) => {
  const name = request.params.username;
  getUserByUsername(name)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchCommentByCommentId = (request, response, next) => {
  const id = request.params.comment_id;
  const { inc_votes } = request.body;
  updateCommentByCommentId(id, inc_votes)
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postArticle = (request, response, next) => {
  const article = request.body;
  addArticle(article)
    .then((newArticle) => {
      response.status(201).send({ newArticle });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postTopic = (request, response, next) => {
  const topic = request.body;
  addTopic(topic)
    .then((newTopic) => {
      response.status(201).send({ newTopic });
    })
    .catch((error) => {
      next(error);
    });
};

exports.deleteArticleByArticleId = (request, response, next) => {
  const id = request.params.article_id;
  removeArticleByArticleId(id)
    .then(() => {
      response.status(204).send({});
    })
    .catch((error) => {
      next(error);
    });
};
