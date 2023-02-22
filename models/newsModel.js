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

exports.updateArticleById = (id, inc_votes) => {
  const query_string = `
  UPDATE articles 
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *
  `;

  return db.query(query_string, [inc_votes, id]).then((results) => {
    if (results.rowCount === 0) {
      return Promise.reject({ status: 404, message: "Article not found" });
    } else {
      return results.rows[0];
    }
  });
};

exports.getCommentsByArticleId = (id) => {
  const queryString = `SELECT * FROM comments WHERE article_id = $1
  ORDER BY created_at DESC`;

  return db.query(queryString, [id]).then((results) => {
    return results.rows;
  });
};

exports.addCommentByArticleId = (id, comment) => {
  const { username, body } = comment;
  const queryString = `
  INSERT INTO comments 
  (author, body, article_id)
  VALUES
  ($1, $2, $3)
  RETURNING *
  `;
  return db.query(queryString, [username, body, id]).then((results) => {
    return results.rows[0];
  });
};

exports.getAllUsers = () => {
  const queryString = `SELECT * FROM users`;

  return db.query(queryString).then((results) => {
    return results.rows;
  });
};

exports.getQueriedArticles = (topic, sort_by, order) => {
  const validOrder = ["asc", "desc"];
  const validColumns = [
    "article_id",
    "title",
    "topics",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
  ];

  if (!validColumns.includes(sort_by) && sort_by) {
    return Promise.reject({ status: 400, message: "Invalid column" });
  }

  if (!validOrder.includes(order) && order) {
    return Promise.reject({ status: 400, message: "Invalid order query" });
  }

  let query_string = `SELECT * FROM articles`;
  const param = [];

  if (topic) {
    query_string += ` WHERE topic = $1`;
    param.push(topic);
  }

  if (sort_by) {
    query_string += ` ORDER BY $1`;
    param.push(sort_by);
  }

  if (order) {
    query_string += ` ORDER BY created_at ${order}`;
  }

  return db.query(query_string, param).then((results) => {
    if (results.rowCount === 0) {
      return Promise.reject({ status: 400, message: "Invalid column" });
    } else {
      return results.rows;
    }
  });
};
