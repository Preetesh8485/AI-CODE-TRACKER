import { catchAsyncError } from "../middleware/CatchAsyncErrors.js"
import  ErrorHandler  from "../middleware/errorMiddleware.js"
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/sendToken.js";
import { SendVerificationEmail } from "../utils/sendverificationemail.js";
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
        await SendVerificationEmail(email,username,verificationURL );
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
export const login=catchAsyncError(async(req,res,next)=>{
        const {username,password}=req.body;
        if(!username||!password){
            return next(new ErrorHandler("All fileds must not be empty!"));
        }
        const user=await User.findOne({username,Accountverification:true}).select("+password");
        if(!user){return next(new ErrorHandler("Invalid Username or password !",400));}
        const isPasswordmatched=await bcrypt.compare(password,user.password);
        if(!isPasswordmatched){
            return next(new ErrorHandler("Invalid Username or password !",400))
        }
        sendToken(user,200,"User Loggedin Successfully!",res);
})
export const logout=catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("token","",{
        expire:new Date(Date.now()),
        httpOnly:true,
        secure:true,
        sameSite:"none",
    }).json({
        success:true,
        message:"Logged out successfully!"
    })
})
export const getUser = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    })
})