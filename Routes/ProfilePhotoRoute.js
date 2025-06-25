const express = require("express")
const validateToken = require("../middleware/auth")
const upload = require("../middleware/multer")
const uploadProfilePhoto = require("../Controllers/profilePhotoHandler")

const router = express.Router()

router.post("/profilePhoto", upload.single('image'), validateToken, uploadProfilePhoto)


module.exports = router