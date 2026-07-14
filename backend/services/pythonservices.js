import FormData from "form-data";
import axios from "axios";

export const parseResumeWithAI = async (file, rawText = "") => {
    const form = new FormData();

    if (file.mimetype === "application/pdf") {
        form.append("file", file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });
    } else if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        form.append("raw_text", rawText);
    } else {
        throw new Error("Unsupported file type");
    }

    try {
        const { data } = await axios.post(
            "http://127.0.0.1:8000/parse",
            form,
            {
                headers: form.getHeaders(),
            }
        );

        return data.result;
    } catch (err) {
        console.error(err.response?.data || err.message);
        throw err;
    }
};