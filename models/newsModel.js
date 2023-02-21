const db = require("../db/connection");

exports.getAllTopics = () => {
  const queryString = `SELECT * FROM topics;`;

  return db.query(queryString).then((results) => {
    return results.rows;
  });
};

exports.getAllArticles = () => {
  const queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.body) AS comment_count FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC
  `;
  return db.query(queryString).then((results) => {
    return results.rows;
  });
};

exports.getCommentsByArticleId = (id) => {
  const queryString = `SELECT * FROM comments WHERE article_id = $1
  ORDER BY created_at DESC`;

  return db.query(queryString, [id]).then((results) => {
    if (results.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Comment not found" });
    } else {
      return results.rows;
    }
  });
};

exports.getArticleById = (id) => {
  const queryString = `SELECT * FROM articles WHERE article_id = $1`;

  return db.query(queryString, [id]).then((results) => {
    if (results.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Article not found" });
    } else {
      return results.rows;
    }
  });
};
