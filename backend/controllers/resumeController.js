import Resume from "../models/resume.js";
import { catchAsyncError } from "../middleware/CatchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { extractDocxText } from "../services/parser/docxParser.js";
import { uploadResumeTocloudinary } from "../utils/uploadResumeToCloudinary.js";
import { deleteResumeFromCloudinary } from "../utils/deleteResumefromCloudinary.js";
import { parseResumeWithAI } from "../services/pythonservices.js";

export const uploadResume = catchAsyncError(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorHandler("Please upload resume!", 400));
    }
    const userId = req.user._id;
    const existingResume = await Resume.findOne({ userId });
    if (existingResume) {
        if (existingResume.publicId) {
            await deleteResumeFromCloudinary(existingResume.publicId);
        }

        await Resume.findByIdAndDelete(existingResume._id);
    }
    let rawText = "";

    if (
        req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        rawText = await extractDocxText(req.file.buffer);

        rawText = rawText
            .replace(/\r/g, "")
            .replace(/\n{2,}/g, "\n\n")
            .trim();
    }
    const parsedData = await parseResumeWithAI(req.file, rawText);
    const uploadedResume = await uploadResumeTocloudinary(
        req.file.buffer,
        userId.toString()
    );
    const resume = await Resume.create({
        userId,

        fileName: req.file.originalname,

        fileUrl: uploadedResume.secure_url,

        publicId: uploadedResume.public_id,

        fileType:
            req.file.mimetype === "application/pdf"
                ? "pdf"
                : "docx",

        rawText,
        parsedData,
    });

    res.status(201).json({
        success: true,
        message: "Resume uploaded successfully.",
        resume,
    });
})
export const getResume = catchAsyncError(async (req, res, next) => {
    const resume = await Resume.findOne({
        userId: req.user._id,
    });

    if (!resume) {
        return next(new ErrorHandler("Resume not found.", 404));
    }

    res.status(200).json({
        success: true,
        resume,
    });
});
export const deleteResume = catchAsyncError(async (req, res, next) => {
    const resume = await Resume.findOne({
        userId: req.user._id,
    });

    if (!resume) {
        return next(new ErrorHandler("Resume not found.", 404));
    }

    await deleteResumeFromCloudinary(resume.publicId);

    await Resume.findByIdAndDelete(resume._id);

    res.status(200).json({
        success: true,
        message: "Resume deleted successfully.",
    });
});