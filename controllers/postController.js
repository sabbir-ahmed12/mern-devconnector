const Joi = require("joi");
const Post = require("../models/Post");
const User = require("../models/User");

const validatePost = (data) => {
  const schema = Joi.object({
    text: Joi.string().min(10).max(300).required(),
  });
  return schema.validate(data);
};

const validateComment = (data) => {
  const schema = Joi.object({
    text: Joi.string().min(1).max(300).required(),
  });
  return schema.validate(data);
};

const createPost = async (req, res) => {
  const { error } = validatePost(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id,
  });
  const result = await newPost.save();
  return res.json(result);
};

const getPosts = async (req, res) => {
  const posts = await Post.find().sort({ date: -1 }).exec();
  if (!posts) return res.status(404).send("No posts found.");
  return res.status(200).send(posts);
};

const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).exec();
  if (!post) return res.status(404).send("No post found with that id.");

  return res.status(200).json(post);
};

const deletePostById = async (req, res) => {
  const user = await User.findOne({ user: req.user.id }).exec();
  const post = await Post.findById(req.params.id).exec();
  if (post.user.toString() !== user.id)
    return res.status(401).send("User not authorized.");

  const result = post.remove();
  if (!result) return res.status(404).send("No post found.");
  return res.status(200).json({ success: true });
};

const likePost = async (req, res) => {
  const post = await Post.findById(req.params.id).exec();
  if (!post) return res.json(404).send("Post not found.");

  if (
    post.likes.filter((like) => like.user.toString() === req.user.id).length > 0
  ) {
    return res.status(400).send("User already liked the post.");
  }
  post.likes.unshift({ user: req.user.id });
  const result = await post.save();
  return res.json(result);
};

const unlikePost = async (req, res) => {
  const post = await Post.findById(req.params.id).exec();
  if (!post) return res.json(404).send("Post not found.");

  if (
    post.likes.filter((like) => like.user.toString() === req.user.id).length ===
    0
  ) {
    return res.status(400).send("You have not liked your post.");
  }
  const removeIndex = post.likes
    .map((item) => item.user.toString())
    .indexOf(req.user.id);

  // Splice out of array
  post.likes.splice(removeIndex, 1);
  const result = await post.save();
  return res.json(result);
};

// Add comment to a post
const addComment = async (req, res) => {
  const { error } = validateComment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const post = await Post.findById(req.params.post_id).exec();
  if (!post) return res.status(404).send("No post found.");
  const newComment = {
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id,
  };

  post.comments.unshift(newComment);
  const result = await post.save();
  if (!result) return res.status(400).send("Comment could not be saved.");
  return res.status(200).json(result);
};

// Delete comment of a post
const deleteComment = async (req, res) => {
  const post = await Post.findById(req.params.post_id).exec();

  if (
    post.comments.filter(
      (comment) => comment.id.toString() === req.params.comment_id
    ).length === 0
  ) {
    return res.status(404).json({ error: "Comment not exists." });
  }

  const removeIndex = post.comments
    .map((item) => item.id.toString())
    .indexOf(req.params.comment_id);
  post.comments.splice(removeIndex, 1);
  const result = post.save();
  if (!result) return res.status(400).send("Comment could not be deleted.");
  return res.status(200).json(post);
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  deletePostById,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
};
