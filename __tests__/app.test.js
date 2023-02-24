const request = require("supertest");
const app = require("../app");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const endpointCheck = require("../endpoints.json");
const articlesRouter = require("../routes/articles-router");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  db.end();
});

describe("app", () => {
  describe("/api/topics", () => {
    it("200: GET - responds with an array of topics containing the properties slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).not.toHaveLength(0);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug", expect.any(String));
            expect(topic).toHaveProperty("description", expect.any(String));
          });
        });
    });
    it("404: GET -  responds with 404 status code of Not Found when given an invalid endpoint", () => {
      return request(app)
        .get("/api/invalid-topic")
        .expect(404)
        .then((body) => {
          const { statusCode } = body;
          expect(statusCode).toBe(404);
        });
    });
  });
  describe("/api/articles", () => {
    it("200: GET - responds with an array of article objects in descending order by date and contains the correct properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).not.toHaveLength(0);
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
          articles.forEach((article) => {
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
            expect(article).toHaveProperty("comment_count", expect.any(String));
          });
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("200: GET - responds with an article object which contains the correct_id and the correct properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).not.toHaveLength(0);
          articles.forEach((article) => {
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", 1);
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
            expect(article).toHaveProperty("body", expect.any(String));
          });
        });
    });
    it("400: GET -  responds with 400 status code of Bad Request when given a string instead of a number", () => {
      return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({ body }) => {
          const error = body.message;
          expect(error).toBe("Bad Request");
        });
    });
    it("404: GET -  responds with 404 status code of Not Found when given a article_id which doesn't exist", () => {
      return request(app)
        .get("/api/articles/1000")
        .expect(404)
        .then(({ body }) => {
          const error = body.message;
          expect(error).toBe("Article not found");
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  it("200: GET - response with an array of comments for the given article_id of which each comment should have the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).not.toHaveLength(0);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", 1);
        });
      });
  });
  it("200: GET -  responds with an empty array of if comments are missing", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(0);
      });
  });
  it("400: GET -  responds with 400 status code of Bad Request when given a string instead of a number", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Bad Request");
      });
  });
  it("404: GET -  responds with 404 status code of Not Found when given a article_id which doesn't exist", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Article not found");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  it("201: POST - responds with the newly added comment object", () => {
    const item = {
      username: "butter_bridge",
      body: "Hello my name sam",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(item)
      .expect(201)
      .then(({ body }) => {
        const { newItem } = body;
        expect(newItem).toHaveProperty("comment_id", expect.any(Number));
        expect(newItem).toHaveProperty("votes", expect.any(Number));
        expect(newItem).toHaveProperty("created_at", expect.any(String));
        expect(newItem).toHaveProperty("author", "butter_bridge");
        expect(newItem).toHaveProperty("body", "Hello my name sam");
        expect(newItem).toHaveProperty("article_id", 1);
      });
  });
  it("404: POST -  responds with 404 status code of Not Found when given a article_id which doesn't exist", () => {
    const item = {
      username: "butter_bridge",
      body: "Hello my name sam",
    };
    return request(app)
      .post("/api/articles/1000/comments")
      .send(item)
      .expect(404)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Not Found");
      });
  });
  it("400: POST -  responds with 400 status code of Bad Request when given a string", () => {
    const item = {
      username: "butter_bridge",
      body: "Hello my name sam",
    };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(item)
      .expect(400)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Bad Request");
      });
  });
  it("404: POST -  responds with 404 status code when username doesn't exist", () => {
    const item = {
      username: "sam",
      body: "Hello my name sam",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(item)
      .expect(404)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Not Found");
      });
  });
  it("400: POST -  responds with 400 status code when body is missing", () => {
    const item = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(item)
      .expect(400)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Bad Request");
      });
  });
});

describe("/api/articles/:article_id", () => {
  it("200: PATCH - responds with updated article with votes changed depending on the request given", () => {
    const update = { inc_votes: -50 };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", 50);
        expect(article).toHaveProperty("article_img_url", expect.any(String));
        expect(article).toHaveProperty("body", expect.any(String));
      });
  });
  it("400: PATCH -  responds with 400 status code passed a string for votes", () => {
    const update = { inc_votes: "hello" };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Bad Request");
      });
  });
  it("404: PATCH -  responds with 404 status code when passed an article_id which doesn't exist", () => {
    const update = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/1000")
      .send(update)
      .expect(404)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Article not found");
      });
  });
  it("400: PATCH -  responds with 400 status code if body is missing", () => {
    const update = {};
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Bad Request");
      });
  });
});

describe("/api/articles?topic=Column", () => {
  it("200: GET - responds with filtered articles based on topic provided", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).not.toHaveLength(0);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", "cats");
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("body", expect.any(String));
        });
      });
  });
  it("200: GET - responds with all articles if topics is missing", () => {
    return request(app)
      .get("/api/articles?topic=")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).not.toHaveLength(0);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
        });
      });
  });
  it("200: GET - responds with an empty array when topic is valid but no articles are present", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(0);
      });
  });
  it("404: GET - responds 404 status code if sort_by column is invalid", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Invalid column");
      });
  });
});

describe("/api/articles?sort_by=Column", () => {
  it("200: GET - responds with sorted articles based on column provided", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).not.toHaveLength(0);
        expect(articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  it("200: GET - responds with sorted articles by dates if column is missing", () => {
    return request(app)
      .get("/api/articles?sort_by=")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).not.toHaveLength(0);
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("404: GET - responds 404 status code if sort_by column is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=banana")
      .expect(404)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Invalid column");
      });
  });
});

describe("/api/articles?order=type", () => {
  it("200: GET - responds with ordered articles based on type provided", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).not.toHaveLength(0);
        expect(articles).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
  });
  it("200: GET - responds with ordered articles based on type provided", () => {
    return request(app)
      .get("/api/articles?order=desc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).not.toHaveLength(0);
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("400: GET - responds 400 status code if order type is invalid", () => {
    return request(app)
      .get("/api/articles?order=hello")
      .expect(400)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Invalid order query");
      });
  });
});

describe("/api/users", () => {
  it("200: GET - responds with an array of users containing the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  it("200: GET - responds with an article object which contains the correct_id and the correct properties and includes comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).not.toHaveLength(0);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", 1);
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(article).toHaveProperty("body", expect.any(String));
        });
      });
  });
});

describe("/api/comments/:comment_id", () => {
  it("204: DELETE - responds with no content and deletes comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((body) => {
        const { statusCode } = body;
        expect(statusCode).toBe(204);
      });
  });
  it("400: DELETE - responds with a 400 status code if comment_id is a string", () => {
    return request(app)
      .delete("/api/comments/hello")
      .expect(400)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Bad Request");
      });
  });
  it("404: DELETE - responds with 404 status code if comment is valid but non-existent", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Comment_id does not exist");
      });
  });
});

describe("/api", () => {
  it("200: GET - responds with a JSON describing all the available endpoints on the API ", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoint } = body;
        expect(endpoint).toEqual(endpointCheck);
      });
  });
});

describe("/api/users/:username", () => {
  it("200: GET -  responds with a user object with the correct username value", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toHaveProperty("username", "icellusedkars");
        expect(user).toHaveProperty("avatar_url", expect.any(String));
        expect(user).toHaveProperty("name", expect.any(String));
      });
  });
  it("400: GET - responds with a 400 status code if username is a number", () => {
    return request(app)
      .get("/api/users/1233")
      .expect(400)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Invalid username");
      });
  });
  it("404: GET - responds with 404 status code if username is valid but non-existent", () => {
    return request(app)
      .get("/api/users/john")
      .expect(404)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Username does not exist");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  it("200: PATCH - responds with the updated comment with its vote decremented or incremented", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toHaveProperty("comment_id", 1);
        expect(comment).toHaveProperty("votes", 6);
        expect(comment).toHaveProperty("created_at", expect.any(String));
        expect(comment).toHaveProperty("author", expect.any(String));
        expect(comment).toHaveProperty("body", expect.any(String));
        expect(comment).toHaveProperty("article_id", expect.any(Number));
      });
  });
  it("400: PATCH - responds with a 400 status code if comment_id is a string", () => {
    return request(app)
      .patch("/api/comments/hello")
      .send({ inc_votes: -1 })
      .expect(400)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Bad Request");
      });
  });
  it("404: PATCH - responds with 404 status code if comment_id is valid but non-existent", () => {
    return request(app)
      .patch("/api/comments/1000")
      .send({ inc_votes: -1 })
      .expect(404)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Comment_id does not exist");
      });
  });
  it("400: PATCH -  responds with 400 status code if body is missing", () => {
    const update = {};
    return request(app)
      .patch("/api/comments/1")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Bad Request");
      });
  });
});

describe("/api/articles", () => {
  it("POST: 201 - responds with 201 status code and the newly added article with correct properties", () => {
    const newItem = {
      author: "butter_bridge",
      topic: "mitch",
      title: "coding",
      body: "how coding improved my life",
      article_img_url: "www.google.com",
    };
    return request(app)
      .post("/api/articles")
      .send(newItem)
      .expect(201)
      .then(({ body }) => {
        const { newArticle } = body;
        expect(newArticle).toHaveProperty("votes", expect.any(Number));
        expect(newArticle).toHaveProperty("created_at", expect.any(String));
        expect(newArticle).toHaveProperty("author", "butter_bridge");
        expect(newArticle).toHaveProperty(
          "body",
          "how coding improved my life"
        );
        expect(newArticle).toHaveProperty("topic", "mitch");
        expect(newArticle).toHaveProperty("title", "coding");
        expect(newArticle).toHaveProperty("article_img_url", "www.google.com");
        expect(newArticle).toHaveProperty("article_id", expect.any(Number));
        expect(newArticle).toHaveProperty("comment_count", expect.any(String));
      });
  });
  it("404: POST -  responds with 404 status code when author doesn't exist", () => {
    const newItem = {
      author: "sam",
      topic: "mitch",
      title: "coding",
      body: "how coding improved my life",
      article_img_url: "www.google.com",
    };
    return request(app)
      .post("/api/articles")
      .send(newItem)
      .expect(404)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Not Found");
      });
  });
  it("404: POST -  responds with 404 status code when topic doesn't exist", () => {
    const newItem = {
      author: "butter_bridge",
      topic: "sam",
      title: "coding",
      body: "how coding improved my life",
      article_img_url: "www.google.com",
    };
    return request(app)
      .post("/api/articles")
      .send(newItem)
      .expect(404)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Not Found");
      });
  });
  it("400: POST -  responds with 400 status code when body is empty", () => {
    const newItem = {};
    return request(app)
      .post("/api/articles")
      .send(newItem)
      .expect(400)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Bad Request");
      });
  });
});

describe("/api/articles?limit=number", () => {
  it("200: GET - responds with a limited number of articles", () => {
    return request(app)
      .get("/api/articles?limit=10")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(10);
      });
  });
  it("400: GET - responds bad request if the limit provided in the query is a string", () => {
    return request(app)
      .get("/api/articles?limit=hello")
      .expect(400)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Bad Request");
      });
  });
});

describe("/api/articles?p=number", () => {
  it("200: GET - responds articles specified with the page at which to start ", () => {
    return request(app)
      .get("/api/articles?p=2")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles[0]).toHaveProperty("article_id", 7);
      });
  });
  it("400: GET - responds with bad request if string is passed in as p value ", () => {
    return request(app)
      .get("/api/articles?p=hey")
      .expect(400)
      .then(({ body }) => {
        const error = body.message;
        expect(error).toBe("Bad Request");
      });
  });
});

describe("/api/articles?limit=10", () => {
  it("200: GET - responds 10 articles and total_count property of all articles", () => {
    return request(app)
      .get("/api/articles?limit=10")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(10);
        articles.forEach((article) => {
          expect(article).toHaveProperty("total_count", "11");
        });
      });
  });
});
