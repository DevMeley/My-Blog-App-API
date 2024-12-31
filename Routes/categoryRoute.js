const express = require("express")
const {createCategoriesHandler, getCategoryHandler} = require("../Controllers/categoryController")
const router = express.Router()


router.post("/create", createCategoriesHandler)
router.get("/all", getCategoryHandler)

module.exports = router