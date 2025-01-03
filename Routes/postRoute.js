const express = require("express")
const {createPostHandler, deletePostHandler, getPostHandler, getSinglePostHandler} = require("../Controllers/userPostController")
const {generalPostHandler, searchPost} = require("../Controllers/generalPostController")
const validateToken = require("../middleware/auth")
const upload = require("../middleware/multer")

const router = express.Router()

router.post("/post", upload.single("image"), validateToken, createPostHandler)
router.delete("/post/delete/:id", validateToken, deletePostHandler)
router.get("/posts/all", validateToken, getPostHandler)


// for general pots
router.get("/all", generalPostHandler)
router.get("", searchPost)

router.get("/:id", getSinglePostHandler)


module.exports = router