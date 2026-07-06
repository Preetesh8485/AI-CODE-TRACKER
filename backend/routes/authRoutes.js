import express from "express";
import { getUser, login, logout, register } from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
const authRouter=express.Router();
authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.get('/logout',logout);
authRouter.get('/me',isAuthenticated,getUser);
export default authRouter;