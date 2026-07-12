import axios from "axios";
export const parseResume = async (text) => {
    const response = await axios.post(
        "http://127.0.0.1:8000/parse",
        {
            text,
        }
    );

    return response.data;
};