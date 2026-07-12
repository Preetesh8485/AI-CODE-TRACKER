import mongoose from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    Accountverification: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    verificationTokenExpire: Date,
    username: {
        type: String,
        required: [true, 'username required'],
        trim: true,
        minlength: [8, 'Username must be atleast 8 characters long'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        trim: true,
        lowercase: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ],
    },
    password: {
        type: String,
        required: [true, "Password field must not be empty"],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false,
        validate: {
            validator: function (value) {
                return !/\s/.test(value);
            },
            message: 'Password cannot contain any spaces, including at the beginning, middle, or end'
        }
    },
    refreshToken: {
        type: String,
        default: null
    },
    platformHandles: {
        leetcode: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true,
            unique: true,
            default: undefined,
        },
        gfg: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true,
            unique: true,
            default: undefined,
        },
        codingNinjas: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true,
            unique: true,
            default: undefined,
        },
    }
}, { timestamps: true }
)
userSchema.methods.generateVerificationToken = function () {
    const token = crypto.randomBytes(32).toString("hex");
    this.verificationToken = crypto.createHash("sha256").update(token).digest("hex");
    this.verificationTokenExpire = Date.now() + 15 * 60 * 1000;
    return token;
}
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE
        }
    );
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE
        }
    );
};
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;