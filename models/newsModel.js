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
  const queryString = `SELECT articles.*, COUNT(comments.body) AS comment_count 
  FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`;

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

exports.getCommentsByArticleId = (id, limit = 10, p) => {
  let queryString = `SELECT * FROM comments WHERE article_id = $1
  ORDER BY created_at DESC LIMIT $2`;
  const params = [id, limit];

  if (p) {
    const offset = limit * (p - 1);
    queryString += ` OFFSET $3`;
    params.push(offset);
  }

  return db.query(queryString, params).then((results) => {
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

async function getValidTopicsArr() {
  const query_string = `SELECT slug FROM topics`;
  return db.query(query_string).then((results) => {
    return results.rows.map((topic) => topic.slug);
  });
}

exports.getQueriedArticles = async (
  topic,
  sort_by = "created_at",
  order = "desc",
  limit = 10,
  p
) => {
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
    "comment_count",
  ];
  const validTopics = await getValidTopicsArr();

  if (topic && !validTopics.includes(topic)) {
    return Promise.reject({ status: 404, message: "Invalid column" });
  }

  if (sort_by && !validColumns.includes(sort_by)) {
    return Promise.reject({ status: 404, message: "Invalid column" });
  }

  if (order && !validOrder.includes(order)) {
    return Promise.reject({ status: 400, message: "Invalid order query" });
  }

  let query_string = `SELECT articles.*, COUNT(comments.body) AS comment_count`;

  if (limit) {
    if (topic) {
      query_string += `, (SELECT COUNT(*) FROM articles WHERE articles.topic = $1) AS total_count`;
    } else {
      query_string += `, (SELECT COUNT(*) FROM articles) AS total_count`;
    }
  }

  query_string += ` FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const param = [];

  if (topic) {
    query_string += ` WHERE articles.topic = $${param.length + 1}`;
    param.push(topic);
  }

  query_string += ` GROUP BY articles.article_id`;

  if (sort_by) {
    if (sort_by === "comment_count") {
      query_string += ` ORDER BY "${sort_by}"`;
    } else {
      query_string += ` ORDER BY ${sort_by}`;
    }
  }

  if (order) {
    query_string += ` ${order}`;
  }

  if (limit) {
    query_string += ` LIMIT $${param.length + 1}`;
    param.push(limit);
  }

  if (p) {
    const offset = limit * (p - 1);
    query_string += ` OFFSET $${param.length + 1}`;
    param.push(offset);
  }

  return db.query(query_string, param).then((results) => {
    return results.rows;
  });
};
exports.removeCommentByCommentId = (id) => {
  const query_string = `DELETE FROM comments WHERE comment_id = $1`;

  return db.query(query_string, [id]).then((results) => {
    if (results.rowCount === 0) {
      return Promise.reject({
        status: 404,
        message: "Comment_id does not exist",
      });
    } else {
      return results.rows;
    }
  });
};

exports.getUserByUsername = (name) => {
  const query_string = `SELECT * FROM users WHERE username = $1`;

  if (isNaN(name)) {
    return db.query(query_string, [name]).then((results) => {
      if (results.rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "Username does not exist",
        });
      } else {
        return results.rows[0];
      }
    });
  } else {
    return Promise.reject({ status: 400, message: "Invalid username" });
  }
};

exports.updateCommentByCommentId = (id, inc_votes) => {
  const query_string = `
  UPDATE comments 
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *
  `;
  return db.query(query_string, [inc_votes, id]).then((results) => {
    if (results.rowCount === 0) {
      return Promise.reject({
        status: 404,
        message: "Comment_id does not exist",
      });
    } else {
      return results.rows[0];
    }
  });
};

exports.addArticle = (article) => {
  const { author, title, body, topic, article_img_url } = article;
  const query_string = `
  INSERT INTO articles
  (author, title, body, topic, article_img_url)
  VALUES 
  ($1, $2, $3, $4, $5)
  RETURNING *,
  (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id ) as comment_count
  `;
  return db
    .query(query_string, [author, title, body, topic, article_img_url])
    .then((results) => {
      return results.rows[0];
    });
};

exports.addTopic = (topic) => {
  const { slug, description } = topic;
  const query_string = `
  INSERT INTO topics
  (slug, description)
  VALUES
  ($1, $2)
  RETURNING *
  `;
  return db.query(query_string, [slug, description]).then((results) => {
    return results.rows[0];
  });
};

exports.removeArticleByArticleId = (id) => {
  const query_string = `
  DELETE FROM articles
  WHERE article_id = $1;
  `;
  return db.query(query_string, [id]).then((results) => {
    if (results.rowCount === 0) {
      return Promise.reject({
        status: 404,
        message: "Article_id does not exist",
      });
    } else {
      return results.rows;
    }
  });
};
