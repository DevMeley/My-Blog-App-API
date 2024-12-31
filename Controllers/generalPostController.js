const Post = require("../Models/Post")

// @desc general post
// @route GET home/posts/all
// access public
const generalPostHandler = async (req, res) => {
    try {
        const generalposts = await Post.find().sort({createdAt:"desc"})
        res.status(200).json({generalposts})
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


// @desc search post by query
// @route GET /publish?username = username , /post/?key = any
// access private
const searchPost = async (req, res) => {
    try {
        const {author} = req.query
        if (!author) {
            return res.status(400).json({
                message:"no posts found"
            })
        }
        const findPosts = await Post.find({author: author})
        res.status(200).json({findPosts})
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


module.exports = {generalPostHandler, searchPost}