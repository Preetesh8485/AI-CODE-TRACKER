import { sendEmail } from "./sendEmail.js";
import { generateVerificationEmailTemplate } from "./emailTemplates.js";

export const SendVerificationEmail = async (
    email,
    username,
    verificationURL
) => {
    await sendEmail({
        email,
        subject: "Verify Your AI Code Tracker Account",
        message: generateVerificationEmailTemplate(
            verificationURL,
            username
        ),
    });
};