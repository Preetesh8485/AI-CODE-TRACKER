import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

export const uploadResumeTocloudinary = (
    fileBuffer,
    userId
) => {
    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",

                // Unique per user
                public_id: `AI-Code-Tracker/Resumes/${userId}/resume`,
            },
            (error, result) => {
                if (error) return reject(error);

                resolve(result);
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};