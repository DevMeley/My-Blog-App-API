const config = require("../config/config")
const User = require("../Models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// @desc Register(create) a user
// @route POST user
// @access public
const registerUserHandler = async (req, res) => {
    try {
        const {username, email, password} = (req.body)

        if (typeof username !=="string") {
            return res.status(400).json({
                message: "username must be a string"
            })
        }

        if (typeof email !== "string") {
            return res.status(400).json({
                message: "email must be a string"
            })
        }

        if (typeof password !== "string") {
            return res.status(400).json({
                message: "password must be a string"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            username,
            email,
            password: hashPassword
        })

        const newUserRegistration = await newUser.save()

        res.status(201).json(newUserRegistration)

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

// @desc User login
// @route POST 
// @access private
const userLoginHandler = async (req, res) => {
    try {
        const {email, password: loginPassword} = req.body
        if (typeof email !=="string") {
            return res.status(400).json({
                message: "email must be a string"
            })
        }

        if (typeof loginPassword !== "string") {
            return res.status(400).json({
                message: "password must be a string"
            })
        }

        const user = await User.findOne({email: email})
        if (!user) {
            return res.status(400).json({
                message: "Email or password is incorrect"
            })
        }

        const validatePassword = await bcrypt.compare(loginPassword, user.password)
        if (!validatePassword) {
            return res.status(400).json({
                message: "Password is incorrect"
            })
        }

        const payLoad = {
            id: user.id,
            email: user.email
        }
        const token = jwt.sign(payLoad, process.env.JWT_SECRET, {expiresIn: "14d"})

        const {password, ...others} = user._doc
        res.status(200).json({
            token,
            others
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {registerUserHandler, userLoginHandler}