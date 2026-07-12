import crypto from "crypto"
export const sendToken = async(user, statusCode, message, res) => {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
    user.refreshToken = hashedRefreshToken;
    await user.save({ validateBeforeSave: false });
    res.status(statusCode).cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        })
        .json({
            success: true,
            message,
            user,
        });
};