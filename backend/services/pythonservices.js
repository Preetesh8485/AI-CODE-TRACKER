import axios from "axios";

export const parseResumeWithAI = async (rawText) => {
    try {
        const { data } = await axios.post(
            "http://127.0.0.1:8000/parse",
            {
                text: rawText,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return data.result;
    } catch (error) {
        console.error(
            "Python AI Error:",
            error.response?.data || error.message
        );
        throw new Error("Failed to parse resume using AI");
    }
};