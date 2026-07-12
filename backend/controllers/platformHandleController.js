import { catchAsyncError } from "../middleware/CatchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import User from "../models/User.js";
import DailyStats from "../models/DailyStats.js";
import { fetchLeetcodeStats } from "../services/leetcodeService.js";
import { fetchCodingNinjasStats } from "../services/codingNinjasService.js";

export const updatehandles = catchAsyncError(async (req, res, next) => {
  const { leetcode, gfg, codingNinjas } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User Not Found!", 404));
  }

  if (leetcode !== undefined) user.platformHandles.leetcode = leetcode.trim();
  if (gfg !== undefined) user.platformHandles.gfg = gfg.trim();
  if (codingNinjas !== undefined) user.platformHandles.codingNinjas = codingNinjas.trim();

  await user.save();
  res.status(200).json({
    success: true,
    message: "Platform handles updated successfully",
    platformHandles: user.platformHandles,
  });
});

export const fetchPlatformStats = catchAsyncError(async (req, res, next) => {
  const { leetcode, gfg, codingNinjas } = req.user.platformHandles;

  if (!leetcode && !gfg && !codingNinjas) {
    return next(new ErrorHandler("Add at least one platform handle before fetching stats.", 400));
  }

  const platforms = {};
  const errors = {};

  if (leetcode) {
    try {
      platforms.leetcode = await fetchLeetcodeStats(leetcode);

      console.log("Leetcode Service Result:");
      console.log(platforms.leetcode);

    } catch (error) {
      console.log(error);
      errors.leetcode = error.message;
    }
  }

  console.log("Platforms Object:");
  console.log(platforms);

  if (gfg) {
    errors.gfg = "GFG stats fetching is not connected yet";
  }

  if (codingNinjas) {
    try {
      platforms.codingNinjas = await fetchCodingNinjasStats(codingNinjas);
    } catch (error) {
      errors.codingNinjas = error.message || "Could not fetch Code360 stats";
    }
  }

  if (Object.keys(platforms).length === 0) {
    return res.status(404).json({
      success: false,
      message: "No platform stats could be fetched.",
      errors,
    });
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const updateFields = {};
  for (const [platformName, stats] of Object.entries(platforms)) {
    updateFields[`platforms.${platformName}`] = stats;
  }
  console.log("Update Fields:");
  console.log(updateFields);
  const dailyStats = await DailyStats.findOneAndUpdate(
    { userId: req.user._id, date: today },
    { $set: updateFields },
    { returnDocument: "after", upsert: true, runValidators: true }
  );
  console.log(JSON.stringify(dailyStats, null, 2));
  res.status(200).json({
    success: true,
    message: "Platform stats fetched successfully",
    dailyStats,
    errors,
  });
});