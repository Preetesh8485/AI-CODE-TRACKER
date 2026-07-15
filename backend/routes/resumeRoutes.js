import express from "express";
import { deleteResume, getResume, uploadResume } from "../controllers/resumeController.js";
import uploadResumeMiddleware from "../middleware/uploadMiddleware.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { analyzeATS } from "../controllers/atsController.js";
const Resumerouter = express.Router();

Resumerouter.post(
    "/upload",
    isAuthenticated,
    uploadResumeMiddleware.single("resume"),
    uploadResume
);
Resumerouter.get(
    "/me",
    isAuthenticated,
    getResume
);

Resumerouter.delete(
    "/me",
    isAuthenticated,
    deleteResume
);
Resumerouter.post(
    "/analyze-ats",
    isAuthenticated,
    uploadResumeMiddleware.single("file"),
    analyzeATS
);
export default Resumerouter;