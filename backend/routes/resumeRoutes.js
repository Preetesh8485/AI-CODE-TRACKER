import express from "express";
import { deleteResume, getResume, uploadResume } from "../controllers/resumeController.js";
import uploadResumeMiddleware from "../middleware/uploadMiddleware.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
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
export default Resumerouter;