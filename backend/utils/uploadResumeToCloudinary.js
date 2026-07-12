import cloudinary from "../utils/cloudinary.js"
import streamifier from "streamifier";
export const uploadResumeTocloudinary = (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder: "AI-Code-Tracker/Resumes",
            resource_type: "raw",
            public_id: fileName.split(".")[0],
        }, (error, result) => {
            if (error) {
                return reject(error);
            }

            resolve(result);
        }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
    })
}