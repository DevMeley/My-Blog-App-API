const express = require ("express")
const connectDB = require("../db")
const defaultRouter = require('../Routes/defaultRoute')
const userRouter = require("../Routes/userRoute")
const postRouter = require("../Routes/postRoute")
const categoryRouter = require("../Routes/categoryRoute")
const cors = require("cors")
const multer = require("multer")
connectDB()
const app = express()


app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:2300', 'http://127.0.0.1:2300'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

  

app.use(express.json())


const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, "images")
    },
    filename : (req, file, cb) => {
        cb(null, "image.jpeg")
    }
})

const upload = multer({storage:storage})
app.post("/publish/upload", upload.single("file"),(req, res) => {
    res.status(200).json("file has been uploaded")
})

app.use("/api/", defaultRouter)
app.use("/api/user", userRouter)
app.use("/api/publish", postRouter)
app.use("/api/category", categoryRouter)



module.exports = app

