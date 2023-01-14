const dotenv = require("dotenv")
const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    dotenv.config();
    mongoose.set('strictQuery', false)
    const conn = await mongoose.connect(process.env.MONGO_URI)

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

module.exports = connectDB