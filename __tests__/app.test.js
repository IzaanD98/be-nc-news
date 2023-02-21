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
    it("400: GET -  responds with 404 status code of Bad Request when given a string instead of a number", () => {
      return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then((body) => {
          const { statusCode } = body;
          expect(statusCode).toBe(400);
        });
    });
    it("404: GET -  responds with 404 status code of Not Found when given a article_id which doesn't exist", () => {
      return request(app)
        .get("/api/articles/1000")
        .expect(404)
        .then((body) => {
          const { statusCode } = body;
          expect(statusCode).toBe(404);
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
  it("404: GET -  responds with 404 status code of Not Found when given a article_id which doesn't exist", () => {
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
  it("400: GET -  responds with 400 status code of Bad Request when given a string", () => {
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
  it("404: GET -  responds with 404 status code when username doesn't exist", () => {
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
  it("400: GET -  responds with 400 status code when body is missing", () => {
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

// describe.only("/api/users", () => {
//   it("200: GET - responds with an array of objects with the correct properties", () => {
//     request(app)
//       .get("/api/users")
//       .expect(200)
//       .then(({ body }) => {
//         const { users } = body;
//         console.log(users);
//         expect(users).not.toHaveLength(0);
//         users.forEach((user) => {
//           expect(user).toHaveProperty("username", expect.any(String));
//           expect(user).toHaveProperty("name", expect.any(String));
//           expect(user).toHaveProperty("avatar_url", expect.any(String));
//         });
//       });
//   });
// });
