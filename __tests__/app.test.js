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
  it("400: GET -  responds with 404 status code of Bad Request when given a string instead of a number", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then((body) => {
        const { statusCode } = body;
        expect(statusCode).toBe(400);
      });
  });
  it("404: GET -  responds with 404 status code of Not Found when given a article_id which doesn't exist", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then((body) => {
        const { statusCode } = body;
        expect(statusCode).toBe(404);
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
});
``;
