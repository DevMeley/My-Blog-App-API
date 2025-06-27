const express = require("express") 
const {registerUserHandler, userLoginHandler} = require("../Controllers/userAuthController")
const {updateProfilePics,updateUsernameHadler, deleteUserHandler, getUserHandler, getProfilehandler} = require("../Controllers/userSettingsController")
const validateToken = require("../middleware/auth")
const upload = require("../middleware/multer")

const router = express.Router()

router.post("/auth/register", registerUserHandler)
router.post("/auth/login", userLoginHandler)
router.put("/settings/uploadProfilePics", upload.single("profilePhoto"), validateToken, updateProfilePics)
router.put("/settings/editUsername", validateToken, updateUsernameHadler)
router.delete("/account/delete", validateToken, deleteUserHandler)
router.get("/settings/account", validateToken, getUserHandler)
router.get("/:username", getProfilehandler)

module.exports = router