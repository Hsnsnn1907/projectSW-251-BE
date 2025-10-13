import mongoose, { connect }  from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const connectData = async () =>{
    try {
        await mongoose.connect(process.env.DB_connect)
        console.log("Server is connected!")
    } catch (error) {
        console.log(error)
    }
}

export default connectData