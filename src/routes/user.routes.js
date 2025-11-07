import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

// Create a new router instance
const router = Router();

// Define POST route for user registration
router.route("/register").post(
    
    // Middleware to handle file uploads using multer
    // upload.fields() allows uploading multiple files with specific field names
    upload.fields([
        {
            name: "avatar",     // Expect a field named "avatar"
            maxCount: 1         // Only allow 1 file for this field
        },
        {
            name: "coverImage", // Expect a field named "coverImage"
            maxCount: 1         // Only allow 1 file for this field
        }
    ]),

    // If upload is successful, move to controller
    registerUser
);

// Export router so it can be used in main application file
export default router;



//  ┌───────────────────────┐
//  |   Client (Frontend)   |
//  |  e.g., React / Postman|
//  └───────────┬───────────┘
//              |  sends POST /register
//              v
//  ┌───────────────────────┐
//  |     Express Router     |
//  |  router.post('/register')
//  └───────────┬───────────┘
//              |  applies middleware
//              v
//  ┌───────────────────────────────────────┐
//  |   Multer Upload Middleware (upload)   |
//  | - Extracts files from request         |
//  | - Stores them temporarily             |
//  | - Attaches info to req.files          |
//  └───────────┬───────────────────────────┘
//              |  If upload succeeds
//              v
//  ┌─────────────────────────┐
//  |   Controller Function   |
//  |     registerUser()      |
//  └───────────┬────────────┘
//              |  asyncHandler wrapper
//              |  means no try/catch needed
//              v
//  ┌───────────────────────────────────────────┐
//  |  Controller Logic Executes:               |
//  |  1. Extracts form data from req.body      |
//  |  2. Validates data                        |
//  |  3. Checks if user already exists         |
//  |  4. Uploads images to Cloudinary          |
//  |  5. Saves user in MongoDB                 |
//  |  6. Removes password before sending back  |
//  └───────────┬───────────────────────────────┘
//              | if success                      if error
//              |                                  |
//              v                                  v
//  ┌─────────────────────┐              ┌────────────────────────┐
//  |   ApiResponse()     |              |   ApiError()           |
//  | success response     |              | goes to error handler |
//  └──────────┬──────────┘              └─────────────┬──────────┘
//             |                                       |
//             v                                       v
//      ┌───────────────────┐                 ┌──────────────────────┐
//      |   Send Response   |                 |   Error Middleware    |
//      |   res.json(...)   |                 | Sends formatted error |
//      └───────────────────┘                 └──────────────────────┘
