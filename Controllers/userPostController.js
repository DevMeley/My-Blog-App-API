const User = require("../Models/User");
const Post = require("../Models/Post");

// @desc CREATE post
// route POST /publish
// @access private
const createPostHandler = async (req, res) => {
  try {
    const user_name = req.user.username;
    const user_id = req.user.id;

    const { title, body } = req.body;
    const newPost = await new Post({
      title,
      body,
      image: req.file ? `/images/${req.file.filename}` : null,
      author: user_name,
      authorId: user_id,
    });

    const createdPost = await newPost.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc DELETE post
// route POST /delete/:id
// @access private
const deletePostHandler = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const userPost = await Post.findByIdAndDelete(id);
    res.status(200).json({
      userPost,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc GET post
// route GET /posts
// @access private
const getPostHandler = async (req, res) => {
  try {
    const authorId = req.user.id;
    const allUserPost = await Post.find({ authorId }).sort({
      createdAt: "desc",
    });
    res.status(200).json({ allUserPost });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc fetch single post
// @route GET /publish/:id
// access public
const getSinglePostHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Not found",
      });
    }
    const singlePost = await Post.findById(id);
    res.status(200).json({ singlePost });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPostHandler,
  deletePostHandler,
  getPostHandler,
  getSinglePostHandler,
};
