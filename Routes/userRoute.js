const express = require("express") 
const {registerUserHandler, userLoginHandler} = require("../Controllers/userAuthController")
const {updateUserHandler, deleteUserHandler, getUserHandler, getProfilehandler} = require("../Controllers/userSettingsController")
const validateToken = require("../middleware/auth")

const router = express.Router()

router.post("/auth/register", registerUserHandler)
router.post("/auth/login", userLoginHandler)
router.put("/settings/edit", validateToken, updateUserHandler)
router.delete("/account/delete", validateToken, deleteUserHandler)
router.get("/settings/account", validateToken, getUserHandler)
router.get("/:username")

module.exports = router