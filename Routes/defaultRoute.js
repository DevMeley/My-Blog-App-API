const express = require("express")
const defaultHandler = require('../Controllers/defaultController')
const router = express.Router()

router.get("/", defaultHandler)

module.exports = router