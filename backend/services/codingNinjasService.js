import axios from "axios";

const getCode360Uuid = (value) => {
  const match = value?.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
  return match ? match[1] : null;
};

export const fetchCodingNinjasStats = async (codingNinjasHandle) => {
  const uuid = getCode360Uuid(codingNinjasHandle);
  if (!uuid) {
    throw new Error("Invalid Code360 profile UUID");
  }

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

  const difficultyData = data?.data?.dsa_domain_data?.problem_count_data?.difficulty_data;
  const totalCount = data?.data?.dsa_domain_data?.problem_count_data?.total_count;

  if (!Array.isArray(difficultyData)) {
    throw new Error("Code360 returned no problem count data");
  }

  const getCount = (level) => difficultyData.find((d) => d.level === level)?.count ?? 0;

  const easy = getCount("Easy");
  const moderate = getCount("Moderate");
  const hard = getCount("Hard");
  const ninja = getCount("Ninja");

  return {
    solved: totalCount ?? easy + moderate + hard + ninja,
    easy,
    moderate,
    hard,
    ninja,
  };
};