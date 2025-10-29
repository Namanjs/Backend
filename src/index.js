// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from './app.js'

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.error("EXPRESS APP ERROR: ", error);
        throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB Connection Failed !!!", err);
    // we use this here despite already having try and catch in connectDB function because in case in future we remove the process.exit from connectDB and only logs it, it will not throw any error since no error is thrown the connectDB() will return a resolved promise despite database not being connected, and here the .then statement will run showing the user undefined.
})



/*
import express from "express"
const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()
*/
