// --- IMPORTS ---
// Import the core 'express' framework.
import express from 'express';
// Import 'cors' to handle Cross-Origin Resource Sharing (a security feature).
import cors from 'cors';
// Import 'cookie-parser' to read and write browser cookies.
import cookieParser from 'cookie-parser';

// --- APP INITIALIZATION ---
// Create the main application instance. This 'app' object
// is what we will configure with middleware and routes.
const app = express();

// --- CORE MIDDLEWARE CONFIGURATION ---
// 'app.use()' is how we "plug in" middleware.
// These are functions that run on every request.

// Configure 'cors' middleware.
// Needed for security, to control which frontend domains
// can make requests to this backend.
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Whitelist our frontend URL (from .env)
    credentials: true // Allow cookies to be sent from the frontend
}))

// Configure the built-in JSON body-parser.
// Needed to parse incoming JSON data from request bodies (e.g., API payloads).
app.use(express.json({
    limit: "16kb" // Security: Prevents overly large JSON payloads
}))

// Configure the built-in URL-encoded body-parser.
// Needed to parse data from HTML forms (e.g., a login form).
app.use(express.urlencoded({
    extended: true, // Allows for complex, nested objects in form data
    limit: "16kb" // Security: Prevents large form data payloads
}))

// Configure the 'static' middleware.
// Needed to serve static assets (like images, favicons, CSS)
// from the "public" folder.
app.use(express.static("public"))

// Configure the 'cookie-parser' middleware.
// Needed to securely read (from 'req.cookies') and set (with 'res.cookie')
// cookies on the user's browser. Essential for auth.
app.use(cookieParser())


// --- ROUTES ---
// This is where we connect our API routes.

// Import the router for user-related API endpoints.
// This follows "Separation of Concerns" by keeping our
// route definitions in a separate 'routes' folder.
import userRouter from './routes/user.routes.js'

// "Mount" the router onto the application.
// This tells Express: "For any request that starts with '/api/v1/users',
// hand it over to the 'userRouter' to find the correct endpoint."
app.use("/api/v1/users", userRouter)

// Example of a full route this creates:
// http://localhost:8000/api/v1/users/register



// --- EXPORT ---
// Export the fully configured 'app' instance.
// This is the "Separation of Concerns" principle in action.
// 'app.js' *defines* the app, and 'index.js' *runs* it.
export { app }