import pdfParse from "pdf-parser";

export const extractPdfText = async (buffer) => {
    try {
        const data = await pdfParse(buffer);
        return data.text.trim();
    } catch (error) {
        throw new Error("Unable to parse PDF.");
    }
};