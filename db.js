const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const connection = await mongoose.connect('mongodb://root:example@localhost:27017/?authSource=admin')
    console.log(`Database connected successfully to ${connection.connection.host}`)
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = connectDB