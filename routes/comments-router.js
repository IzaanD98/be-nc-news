const {
  deleteCommentByCommentId,
  patchCommentByCommentId,
} = require("../controllers/newsController");

const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentByCommentId)
  .patch(patchCommentByCommentId);

module.exports = commentsRouter;
