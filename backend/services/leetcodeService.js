import axios from "axios";

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

const leetcodeRequest = (query, variables) =>
axios.post(
LEETCODE_GRAPHQL_URL,
{ query, variables },
{
headers: {
"Content-Type": "application/json",
Referer: "https://leetcode.com/",
"User-Agent": "Mozilla/5.0",
},
}
);

const GET_PROFILE_STATS = `  query userProfileUserQuestionProgressV2($userSlug: String!) {
    userProfileUserQuestionProgressV2(userSlug: $userSlug) {
      numAcceptedQuestions {
        difficulty
        count
      }
    }
  }`;

const GET_RECENT_ACCEPTED_SUBMISSIONS = `  query recentAcSubmissionList($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      titleSlug
      timestamp
    }
  }`;

const GET_QUESTION_TOPICS = `  query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      topicTags {
        slug
      }
    }
  }`;

const getQuestionTopics = async (titleSlug) => {
const { data } = await leetcodeRequest(GET_QUESTION_TOPICS, {
titleSlug,
});

return data.data?.question?.topicTags || [];
};

export const fetchLeetcodeStats = async (leetcodeHandle) => {
const { data } = await leetcodeRequest(GET_PROFILE_STATS, {
userSlug: leetcodeHandle,
});

const accepted =
data.data?.userProfileUserQuestionProgressV2?.numAcceptedQuestions;

if (!Array.isArray(accepted)) {
throw new Error("LeetCode handle not found or profile is unavailable");
}

const getCount = (difficulty) =>
accepted.find(
(item) =>
item.difficulty?.toLowerCase() === difficulty.toLowerCase()
)?.count ?? 0;

const easy = getCount("easy");
const medium = getCount("medium");
const hard = getCount("hard");

const { data: submissionsData } = await leetcodeRequest(
GET_RECENT_ACCEPTED_SUBMISSIONS,
{
username: leetcodeHandle,
limit: 100,
}
);

const submissions =
submissionsData.data?.recentAcSubmissionList || [];

const today = new Date().toISOString().slice(0, 10);

const solvedToday = submissions.filter((submission) => {
const submissionDate = new Date(
Number(submission.timestamp) * 1000
)
.toISOString()
.slice(0, 10);

```
return submissionDate === today;
```

});

const uniqueProblemSlugs = [
...new Set(solvedToday.map((submission) => submission.titleSlug)),
];

const topics = {};

for (const titleSlug of uniqueProblemSlugs) {
const questionTopics = await getQuestionTopics(titleSlug);

```
for (const topic of questionTopics) {
  topics[topic.slug] = (topics[topic.slug] || 0) + 1;
}
```

}

return {
solved: getCount("all") || easy + medium + hard,
easy,
medium,
hard,
topics,
};
};
