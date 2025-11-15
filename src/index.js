// --- IMPORTS ---
// We're using the modern 'import' syntax for our libraries.
// 'dotenv' is for loading secrets from our .env file.
// 'connectDB' is our custom function to connect to the database.
// 'app' is our configured Express application from app.js.
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from './app.js'

// --- DOTENV CONFIGURATION ---
// Needed to load our environment variables (like PORT and MONGODB_URI)
// from the .env file into 'process.env'.
dotenv.config({
    path: './.env'
})

// --- ASYNC DATABASE CONNECTION & SERVER START ---
// This is the main logic. We must connect to the DB *before* starting the server.
connectDB()
    .then(() => {
        // --- SUCCESS: DB IS CONNECTED ---

        // This is a "safety net" listener.
        // Needed to catch any errors the 'app' itself might have
        // *after* it's already running.
        app.on("error", (error) => {
            console.error("EXPRESS APP ERROR: ", error);
            throw error;
        });

        // Now that the DB is connected, we can safely start the server.
        // Needed to tell the app to start listening for HTTP requests.
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT || 8000}`);
        })
    })
    .catch((err) => {
        // --- FAILURE: DB CONNECTION FAILED ---
        s
        // Log the error if the DB connection promise rejects.
        console.log("MongoDB Connection Failed !!!", err);

        // This is "Defensive Programming."
        // We have this .catch() here in case 'connectDB' is ever changed
        // to 'throw error' instead of 'process.exit(1)'.
        // This ensures we always handle a connection failure gracefully.
    })



/*
// --- ALTERNATIVE METHOD (COMMENTED OUT) ---
//
// This is an IIFE (Immediately Invoked Function Expression).
// It's just another way to write the same "connect then listen" logic,
// but it's less clean than separating concerns (like we did above).

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