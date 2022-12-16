const express = require("express");
const router = express.Router();
const postController = require("../../controllers/postController");

router.post("/", postController.createPost);
router.delete("/:id", postController.deletePostById);
router.post("/like/:id", postController.likePost);
router.post("/unlike/:id", postController.unlikePost);
router.post("/comment/:post_id", postController.addComment);
router.delete("/comment/:post_id/:comment_id", postController.deleteComment);
module.exports = router;
