import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}
async function dbConnect(): Promise<void> {
    if(connection.isConnected) return ;
    console.log('MONGODB_URI--->', process.env.MONGODB_URI)
    console.log('DATABASE_NAME--->',process.env.DATABASE_NAME)
    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}` ,{
            dbName: process.env.DATABASE_NAME
        })
        connection.isConnected = db.connections[0].readyState
        console.log('Database connected successfully')
    } catch (error) {
        console.log('Database connection failed')
        process.exit(1)
    }
}

export default dbConnect