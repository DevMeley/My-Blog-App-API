const express = require ("express")
const connectDB = require("../db")
const defaultRouter = require('../Routes/defaultRoute')
const userRouter = require("../Routes/userRoute")
const postRouter = require("../Routes/postRoute")
const categoryRouter = require("../Routes/categoryRoute")
const path = require("path")
const cors = require("cors")
const fs = require('fs')

connectDB()

const app = express()


app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:2300', 'http://127.0.0.1:2300', "https://blog-app-with-react-js-rho.vercel.app"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));


if (!fs.existsSync(path.join(__dirname, 'public/images'))) {
  fs.mkdirSync(path.join(__dirname, 'public/images'), { recursive: true });
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("./images", express.static(path.join(__dirname, "Public/images"))); 



app.use("/", defaultRouter)
app.use("/api/user", userRouter)
app.use("/api/publish", postRouter)
app.use("/api/category", categoryRouter)



module.exports = app

