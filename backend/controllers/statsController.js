// import { catchAsyncError } from "../middleware/CatchAsyncErrors.js";
// import DailyStats from "../models/DailyStats.js";
// import User from "../models/User.js";

// export const syncStats = catchAsyncError(async (req, res, next) => {
//     const userId = req.user._id;

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const user = await User.findById(userId);

//     if (!user) {
//         return next(new ErrorHandler("User not found", 404));
//     }
//     const leetcodeUsername = user.platformHandles.leetcode;
//     const gfgUsername = user.platformHandles.gfg;
//     const codingNinjasUsername = user.platformHandles.codingNinjas;
//     const leetcodeData = {};
//     const gfgData = {};
//     const codingNinjasData = {};
//     const dailyStats = await DailyStats.findOneAndUpdate(
//         {
//             userId,
//             date: today,
//         },
//         {
//             $set: {
//                 platforms: {
//                     leetcode: leetcodeData,
//                     gfg: gfgData,
//                     codingNinjas: codingNinjasData,
//                 },
//             },
//         },
//         {
//             upsert: true,
//             new: true,
//         }
//     );

//     res.status(200).json({
//         success: true,
//         dailyStats,
//     });
// });