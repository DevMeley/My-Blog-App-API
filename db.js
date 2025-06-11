const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const URL = process.env.MONGODB_URL


const connectDB = async () => {
    // try {
    //     const connection = await mongoose.connect('mongodb://root:example@localhost:27017/?authSource=admin')
    // console.log(`Database connected successfully to ${connection.connection.host}`)
    // } catch (error) {
    //     console.log(error)
    // }
    try {
        const connection = await mongoose.connect(URL)
    console.log(`Database connected successfully to ${connection.connection.host}`)
    } catch (error) {
        console.log(error)
    }
     
}


module.exports = connectDB