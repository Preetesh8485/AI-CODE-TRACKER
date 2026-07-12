import { catchAsyncError } from "../middleware/CatchAsyncErrors.js"
import ErrorHandler from "../middleware/errorMiddleware.js"
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/sendToken.js";
import { SendVerificationEmail } from "../utils/sendverificationemail.js";
import jwt from "jsonwebtoken";
import crypto from "crypto"
export const register = catchAsyncError(async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return next(new ErrorHandler("Fill all details!", 400));
    }
    const accountexists = await User.findOne({ email, Accountverification: true });
    if (accountexists) {
        return next(new ErrorHandler("Account with this email already exists", 400));
    }
    const registrationAttemptsByUser = await User.find({
        email,
        Accountverification: false,
    });
    if (registrationAttemptsByUser.length >= 5) {
        return next(new ErrorHandler("Too many unsuccessful attempts, please contact support", 400));
    }
    if (password.length < 8 || password.length > 16) {
        return next(new ErrorHandler("Password should be between 8-16 characters ", 400));
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        username,
        email,
        password: hashedpassword
    });
    const verificationToken = newUser.generateVerificationToken();
    await newUser.save();
    const verificationURL = `${process.env.FRONTEND_URL}/verify-account/${verificationToken}`;
    await SendVerificationEmail(email, username, verificationURL);
    res.status(201).json({
        success: true,
        message: "Verification email sent successfully"
    })

})
export const verifyaccount = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    const user = await User.findOne({
        verificationToken: hashedToken,
        verificationTokenExpire: { $gt: Date.now() }
    });
    if (!user) {
        return next(
            new ErrorHandler("Invalid or expired verification link.", 400)
        );
    }
    user.Accountverification = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Account verified successfully."
    });

})
export const login = catchAsyncError(async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return next(new ErrorHandler("All fileds must not be empty!"));
    }
    const user = await User.findOne({ username, Accountverification: true }).select("+password");
    if (!user) { return next(new ErrorHandler("Invalid Username or password !", 400)); }
    const isPasswordmatched = await bcrypt.compare(password, user.password);
    if (!isPasswordmatched) {
        return next(new ErrorHandler("Invalid Username or password !", 400))
    }
    await sendToken(user, 200, "User Loggedin Successfully!", res);
})
export const logout = catchAsyncError(async (req, res, next) => {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
        const hashedRefreshToken = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        const user = await User.findOne({
            refreshToken: hashedRefreshToken,
        });

        if (user) {
            user.refreshToken = null;
            await user.save({ validateBeforeSave: false });
        }
    }
    res.status(200)
        .cookie("accessToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: new Date(0),
        })
        .cookie("refreshToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: new Date(0),
        })
        .json({
            success: true,
            message: "Logged out successfully!",
        });
});
export const getUser = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    })
})
export const refreshToken=catchAsyncError(async(req,res,next)=>{
    const{refreshToken}=req.cookies;
    if(!refreshToken){
        return next(new ErrorHandler("Refresh Token not found!",401));
    }
    const hashedRefreshToken=crypto.createHash("sha256").update(refreshToken).digest("hex");
    const user=await User.findOne({refreshToken:hashedRefreshToken});
    if(!user){
         return next(new ErrorHandler("Invalid refresh token", 401));
    }
    let decoded;
     try {
        decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
    } catch (err) {
        return next(new ErrorHandler("Refresh token expired or invalid", 401));
    }
     if (decoded.id !== user._id.toString()) {
        return next(new ErrorHandler("Invalid refresh token", 401));
    }
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();
    const hashedNewRefreshToken = crypto
        .createHash("sha256")
        .update(newRefreshToken)
        .digest("hex");

    user.refreshToken = hashedNewRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200)
        .cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        })
        .cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        })
        .json({
            success: true,
            message: "Access token refreshed successfully",
        });
});