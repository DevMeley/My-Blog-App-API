const User = require("../Models/User")
const jwt = require("jsonwebtoken")
const config = require("../config/config")


const validateToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                message: "Authorization header required"
            })
        }
        let token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).josn({
                message: "Invalid Token"
            })
        }

        const payLoad = jwt.verify(token, config.jwt_secret_code)
        if (!payLoad) {
            return res.status(401).json({
                message: "Invalid"
            })
        }

        const user = await User.findById(payLoad.id)
        if (!user) {
            return res.status(400).json({
                message: "Error fetching user"
            })
        }

        req.user = user
        next()
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = validateToken