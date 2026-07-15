import { catchAsyncError } from "../middleware/CatchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import Resume from "../models/resume.js";
import { analyzeATSWithAI } from "../services/pythonservices.js";
export const analyzeATS = catchAsyncError(
    async (req, res, next) => {

        const userId = req.user._id;

        const { jobDescription } = req.body;
        if (!jobDescription?.trim() && !req.file) {
            return next(
                new ErrorHandler(
                    "Please provide a job description or upload a JD PDF.",
                    400
                )
            );
        }

        const resume = await Resume.findOne({
            userId
        });

        if (!resume) {
            return next(
                new ErrorHandler(
                    "Please upload a resume first.",
                    404
                )
            );
        }

        if (!resume.parsedData) {
            return next(
                new ErrorHandler(
                    "Resume has not been parsed.",
                    400
                )
            );
        }

        const atsReport = await analyzeATSWithAI(
            resume.parsedData,
            jobDescription,
            req.file
        );

        resume.atsReport = atsReport;

        await resume.save();

        res.status(200).json({
            success: true,
            message: "ATS analysis completed successfully.",
            atsReport,
        });
    }
);