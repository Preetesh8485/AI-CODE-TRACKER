import mongoose from "mongoose";
import crypto from "crypto";
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
        minlength: [8, 'Username must be atleast 8 characters long']
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
        select:false,
        validate: {
            validator: function (value) {
                return !/\s/.test(value);
            },
            message: 'Password cannot contain any spaces, including at the beginning, middle, or end'
        }
    },
    platformHandles: {
        leetcode: {
            type: String,
            default: ''
        },
        gfg: {
            type: String,
            default: ''
        },
        codingNinjas: {
            type: String,
            default: ''
        },

    }
}, { timestamps: true }
)
userSchema.methods.generateVerificationToken=function(){
const token =crypto.randomBytes(32).toString("hex");
this.verificationToken=crypto.createHash("sha256").update(token).digest("hex");
this.verificationTokenExpire=Date.now()+15*60*1000;
 return token;
}
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;