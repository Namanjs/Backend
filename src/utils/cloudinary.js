import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// We configure Cloudinary using the credentials stored in environment variables.
// This keeps our API keys secret and not hard-coded in the project.
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// This function uploads a file from a local filepath to Cloudinary.
const uploadOnCloudinary = async (localFilePath) => {
    try {
        // If no file path is provided, nothing to upload → return null.
        if (!localFilePath) return null;

        // Upload the file to Cloudinary.
        // `resource_type: "auto"` means Cloudinary will detect file type automatically
        // (image, video, docs, etc.).
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // If upload succeeds, remove the file from our local server storage.
        // We only needed it temporarily.
        fs.unlinkSync(localFilePath);

        // Return Cloudinary's response (contains URL, public_id, etc.)
        return response;

    } catch (error) {
        // If upload fails for any reason, remove the temporary local file anyway,
        // because we don't want unused files piling up on our server.
        fs.unlinkSync(localFilePath);

        // Return null to signal that upload failed.
        return null;
    }
};

export { uploadOnCloudinary };
