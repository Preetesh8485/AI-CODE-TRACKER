import axios from "axios";
import { catchAsyncError } from "../middleware/CatchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import User from "../models/User.js";
import DailyStats from "../models/DailyStats.js";
const getCode360Uuid = (value) => {
  const match = value?.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
  );

  return match ? match[1] : null;
};

export const updatehandles = catchAsyncError(async (req, res, next) => {
    
    const { leetcode, gfg, codingNinjas } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ErrorHandler("User Not Found!", 404));
    }
    if (leetcode !== undefined) {
        user.platformHandles.leetcode = leetcode.trim();
    }

    if (gfg !== undefined) {
        user.platformHandles.gfg = gfg.trim();
    }

    if (codingNinjas !== undefined) {
        user.platformHandles.codingNinjas = codingNinjas.trim();
    }
    await user.save();
    res.status(200).json({
        success: true,
        message: "Platform handles updated successfully",
        platformHandles: user.platformHandles,
    })

})
export const fetchPlatformStats = catchAsyncError(async (req, res, next) => {
    const { leetcode, gfg, codingNinjas } = req.user.platformHandles;

    if (!leetcode && !gfg && !codingNinjas) {
        return next(
            new ErrorHandler(
                "Add at least one platform handle before fetching stats.",
                400
            )
        );
    }

    const platforms = {};
    const errors = {};

    if (leetcode) {
        try {
            const { data } = await axios.post(
                "https://leetcode.com/graphql",
                {
                    query: `
            query userProfileUserQuestionProgressV2($userSlug: String!) {
              userProfileUserQuestionProgressV2(userSlug: $userSlug) {
                numAcceptedQuestions {
                  difficulty
                  count
                }
              }
            }
          `,
                    variables: {
                        userSlug: leetcode,
                    },
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": "Mozilla/5.0",
                    },
                }
            );

            const accepted =
                data.data?.userProfileUserQuestionProgressV2?.numAcceptedQuestions;

            if (!Array.isArray(accepted)) {
                errors.leetcode = "LeetCode handle not found or profile is unavailable";
            } else {
                const getCount = (difficulty) =>
                    accepted.find(
                        (item) =>
                            item.difficulty?.toLowerCase() === difficulty.toLowerCase()
                    )?.count ?? 0;

                const easy = getCount("easy");
                const medium = getCount("medium");
                const hard = getCount("hard");

                platforms.leetcode = {
                    solved: getCount("all") || easy + medium + hard,
                    easy,
                    medium,
                    hard,
                };
            }
        } catch (error) {
            errors.leetcode = "Could not fetch LeetCode stats";
        }
    }

    if (gfg) {
        errors.gfg = "GFG stats fetching is not connected yet";
    }

    if (codingNinjas) {
  try {
    const uuid = getCode360Uuid(codingNinjas);

    if (!uuid) {
      errors.codingNinjas = "Invalid Code360 profile UUID";
    } else {
      const { data } = await axios.get(
        "https://www.naukri.com/code360/api/v3/public_section/profile/user_details",
        {
          params: {
            uuid,
            request_differentiator: Date.now(),
            app_context: "publicsection",
            naukri_request: true,
          },
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0",
          },
        }
      );

      const difficultyData =
        data?.data?.dsa_domain_data?.problem_count_data?.difficulty_data;
      const totalCount =
        data?.data?.dsa_domain_data?.problem_count_data?.total_count;

      if (!Array.isArray(difficultyData)) {
        errors.codingNinjas = "Code360 returned no problem count data";
      } else {
        const getCount = (level) =>
          difficultyData.find((d) => d.level === level)?.count ?? 0;

        const easy = getCount("Easy");
        const moderate = getCount("Moderate");
        const hard = getCount("Hard");
        const ninja = getCount("Ninja");

        platforms.codingNinjas = {
          solved: totalCount ?? easy + moderate + hard + ninja,
          easy,
          moderate,
          hard,
          ninja,
        };
      }
    }
  } catch (error) {
    errors.codingNinjas = "Could not fetch Code360 stats";
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

    const dailyStats = await DailyStats.findOneAndUpdate(
        {
            userId: req.user._id,
            date: today,
        },
        {
            $set: updateFields,
        },
        {
            returnDocument: "after",
            upsert: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        success: true,
        message: "Platform stats fetched successfully",
        dailyStats,
        errors,
    });
});