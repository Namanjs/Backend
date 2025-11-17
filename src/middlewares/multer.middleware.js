import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})

// User sends request (e.g., POST /register with files)
//              ↓
// Route: router.route("/register").post( upload.fields([...]), registerUser )
//              ↓
// The FIRST middleware runs: `upload.fields([...])`
//              ↓
// ┌──────────────────────────────────────────────────────────┐
// │ Inside Multer (The "Staging Area" Creator)               │
// │                                                          │
// │ 1. `destination()` runs:                                 │
// │    Tells Multer to use the "./public/temp" folder.       │
// │                                                          │
// │    (Why `null`? It's an error-first callback.            │
// │     We pass `null` because our *logic* for               │
// │     choosing the folder didn't have an error.)           │
// │                                                          │
// │ 2. `filename()` runs:                                    │
// │    Creates a unique name (e.g., "12345-avatar.jpg")      │
// │                                                          │
// │    (Why a unique name? To fix the "naming conflict"      │
// │     if 2 users upload a file with the same name.)        │
// │                                                          │
// │ Result: File is saved to './public/temp/12345-avatar.jpg'│
// │         Multer saves the file path to `req.files`        │
// └──────────────────────────────────────────────────────────┘