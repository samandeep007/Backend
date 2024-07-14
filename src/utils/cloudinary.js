import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log(response);

        // Delete the local file after uploading
        fs.unlinkSync(localFilePath);

        console.log("File is uploaded on Cloudinary ", response.url);

        return response;
    } catch (error) {
        // Delete the local file in case of an error
        fs.unlinkSync(localFilePath);

        return null;
    }
};

export { uploadOnCloudinary };
