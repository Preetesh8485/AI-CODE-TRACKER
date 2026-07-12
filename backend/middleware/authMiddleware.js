import { catchAsyncError } from "./CatchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
const { accessToken } = req.cookies;

if (!accessToken) {
    return next(new ErrorHandler("User not authenticated", 401));
}

const decoded = jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_SECRET
);

  req.user = await User.findById(decoded.id);

  if (!req.user) {
    return next(new ErrorHandler("User not found", 401));
  }

  next();
});