import mammoth from "mammoth";

export const extractDocxText = async (buffer) => {
    try {
        const result = await mammoth.extractRawText({
            buffer,
        });

        return result.value.trim();
    } catch (error) {
        throw new Error("Unable to parse DOCX.");
    }
};