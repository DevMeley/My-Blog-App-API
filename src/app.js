const express = require ("express")
const connectDB = require("../db")
const defaultRouter = require('../Routes/defaultRoute')
const userRouter = require("../Routes/userRoute")
const postRouter = require("../Routes/postRoute")
const categoryRouter = require("../Routes/categoryRoute")
const path = require("path")
const cors = require("cors")

connectDB()

const app = express()


app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:2300', 'http://127.0.0.1:2300'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

  

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/images", express.static(path.join(__dirname, "images"))); 



app.use("/api/", defaultRouter)
app.use("/api/user", userRouter)
app.use("/api/publish", postRouter)
app.use("/api/category", categoryRouter)



module.exports = app

