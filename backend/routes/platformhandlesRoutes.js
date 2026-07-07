import express from "express"
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { fetchPlatformStats, updatehandles } from "../controllers/platformHandleController.js";
const phRouter=express.Router();
phRouter.put("/handles",isAuthenticated,updatehandles);
phRouter.get("/stats", isAuthenticated, fetchPlatformStats);
export default phRouter;