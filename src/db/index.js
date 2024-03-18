import mongoose from "mongoose";
import {DB_NAME} from '../constants.js'
const connectToDB= async()=>{
    try {
        const connetionInstance = await mongoose.connect(
            `${process.env.DB_STRING}${DB_NAME}`
        )
        console.log(`\n MONGODB Connected !! DB HOST:=>`,connetionInstance.connection.host)
    } catch (error) {
        console.log(`MONGODB Connection Error:${error.message}`)
    }
}

export default connectToDB;