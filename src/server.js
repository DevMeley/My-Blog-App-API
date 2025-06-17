const app = require('./app')
const dotenv = require("dotenv")

dotenv.config()

const PORT = process.env.PORT

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})

console.log(process.env.MONGODB_URL)