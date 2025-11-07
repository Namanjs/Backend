import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from '../utils/ApiResponse.js';


// Wrapped in asyncHandler → removes need for try/catch.
// Any thrown ApiError will automatically be forwarded to the global error handler.
const registerUser = asyncHandler(async (req, res) => {

    // Extract data sent by frontend
    const { fullName, username, password, email } = req.body;

    // Validate: Check if any field is empty.
    // `.some()` returns true if at least one value satisfies the condition.
    // `field?.trim()` → Optional chaining used to avoid errors if field is undefined.
    if ([fullName, username, password, email].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required.");
    }

    // Check if a user already exists
    // `$or` → MongoDB operator that matches documents where *at least one* condition is true.
    // This tries to find a user with either the same username OR email.
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with username or email already exists.");
    }

    // Multer stores uploaded files in req.files
    // `?.` optional chaining → prevents errors if any step in the chain is missing.
    // `[0]` → because multer stores files as arrays even if only 1 file is uploaded.
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    // Avatar is mandatory; cover image is optional
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required.");
    }

    // Upload to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed.");
    }

    // Create a new user
    const user = await User.create({
        fullName,
        avatar: avatar.url,                 
        coverImage: coverImage?.url || "",   // If cover image is missing → store empty string
        email,
        password,
        username: username.toLowerCase()     // Normalizes input to avoid case-based duplicates
    });

    // Fetch user again but remove sensitive fields
    // `.select("-field")` → Exclude these fields from the returned object
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user.");
    }

    // Respond to client in a consistent format using ApiResponse
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully.")
    );

});

export { registerUser };
