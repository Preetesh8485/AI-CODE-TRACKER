import cloudinary from "../utils/cloudinary.js";

export const deleteResumeFromCloudinary = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw",
    });
};