import { catchAsyncError } from "./CatchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const isAuthenticated=catchAsyncError(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return next(new ErrorHandler("User not authenticated",401))
    }
    const decoded=jwt.verify(process.env.JWT_SECRET_KEY);
    req.user =await User.findById(decoded.id);
    next();
})