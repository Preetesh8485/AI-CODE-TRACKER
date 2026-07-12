import { extractPdfText } from "./pdfParser.js";
import { extractDocxText } from "./docxParser.js";

export const extractResumeText = async (file) => {
    switch (file.mimetype) {
        case "application/pdf":
            return await extractPdfText(file.buffer);

        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return await extractDocxText(file.buffer);

        default:
            throw new Error("Unsupported file type.");
    }
};