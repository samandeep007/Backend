import mongoose from 'mongoose';
import { DB_Name } from '../constants.js';

const connectDB = async() => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_Name}` || '');
        const connectionReference = mongoose.connection;

        connectionReference.on('connected', () => {
            console.log("MongoDB connected");
        })

        connectionReference.on('error', (error) => {
            console.log("MongoDB connection error, please make sure db is up and running" + error);
            process.exit(1);
        })
        
    } catch (error) {
        console.log("Something went wrong while connecting to the database: ", error);
    }
}

export {connectDB};