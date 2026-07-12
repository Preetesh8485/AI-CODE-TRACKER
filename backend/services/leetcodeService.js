import axios from "axios";

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

const GET_PROFILE_STATS = `
query userProfileUserQuestionProgressV2($userSlug: String!) {
  userProfileUserQuestionProgressV2(userSlug: $userSlug) {
    numAcceptedQuestions {
      difficulty
      count
    }
  }
}
`;

export const fetchLeetcodeStats = async (leetcodeHandle) => {
  const { data } = await axios.post(
    LEETCODE_GRAPHQL_URL,
    {
      query: GET_PROFILE_STATS,
      variables: {
        userSlug: leetcodeHandle,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com/",
        "User-Agent": "Mozilla/5.0",
      },
    }
  );

  const accepted =
    data?.data?.userProfileUserQuestionProgressV2?.numAcceptedQuestions;

  if (!Array.isArray(accepted)) {
    throw new Error("LeetCode handle not found or profile unavailable");
  }

  const getCount = (difficulty) =>
    accepted.find(
      (item) =>
        item.difficulty?.toLowerCase() === difficulty.toLowerCase()
    )?.count ?? 0;

  const easy = getCount("easy");
  const medium = getCount("medium");
  const hard = getCount("hard");

  return {
    solved: easy + medium + hard,
    easy,
    medium,
    hard,
  };
};