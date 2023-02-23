const { deleteCommentByCommentId } = require("../controllers/newsController");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").delete(deleteCommentByCommentId);

module.exports = commentsRouter;
