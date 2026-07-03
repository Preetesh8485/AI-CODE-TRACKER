import apiInstance from "../config/brevo.js";

export const sendEmail = async ({
    email,
    subject,
    message
}) => {

    await apiInstance.sendTransacEmail({

        sender: {
            email: process.env.SENDER_EMAIL,
            name: "AI CODE TRACKER"
        },

        to: [
            {
                email: email
            }
        ],

        subject: subject,

        htmlContent: message
    });
};