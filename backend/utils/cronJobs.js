import cron from "node-cron";
import User from "../models/User.js";
import DailyStats from "../models/DailyStats.js";
import { fetchLeetcodeStats } from "../services/leetcodeService.js";
import { fetchCodingNinjasStats } from "../services/codingNinjasService.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const refreshStatsForUser = async (user) => {
  const { leetcode, codingNinjas } = user.platformHandles;
  const platforms = {};

  if (leetcode) {
    try {
      platforms.leetcode = await fetchLeetcodeStats(leetcode);
    } catch (error) {
      console.error(`[cron] LeetCode failed for user ${user._id}:`, error.message);
    }
  }

  if (codingNinjas) {
    try {
      platforms.codingNinjas = await fetchCodingNinjasStats(codingNinjas);
    } catch (error) {
      console.error(`[cron] Code360 failed for user ${user._id}:`, error.message);
    }
  }
  if (Object.keys(platforms).length === 0) return;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const updateFields = {};
  for (const [platformName, stats] of Object.entries(platforms)) {
    updateFields[`platforms.${platformName}`] = stats;
  }

  await DailyStats.findOneAndUpdate(
    { userId: user._id, date: today },
    { $set: updateFields },
    { upsert: true, runValidators: true }
  );
};

export const UpdateData = () => {
  cron.schedule("0 2 * * *", async () => {
    console.log("[cron] Starting daily platform stats refresh");

    try {
      const users = await User.find({
        $or: [
          { "platformHandles.leetcode": { $ne: "" } },
          { "platformHandles.codingNinjas": { $ne: "" } },
        ],
      });

      for (const user of users) {
        await refreshStatsForUser(user);
        await sleep(1000); // stagger requests — don't hammer Code360/LeetCode back-to-back
      }

      console.log(`[cron] Finished refreshing stats for ${users.length} users`);
    } catch (error) {
      console.error("[cron] Fatal error during stats refresh:", error);
    }
  });
};