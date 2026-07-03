export const generateVerificationEmailTemplate = (
    verificationURL,
    username
) => {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body{
    margin:0;
    padding:0;
    background:#f4f6f9;
    font-family:Arial,Helvetica,sans-serif;
}
.container{
    max-width:600px;
    margin:40px auto;
    background:#ffffff;
    border-radius:10px;
    overflow:hidden;
    box-shadow:0 4px 15px rgba(0,0,0,.08);
}
.header{
    background:#2563eb;
    color:#ffffff;
    text-align:center;
    padding:25px;
}
.content{
    padding:35px;
    color:#444;
    text-align:center;
    line-height:1.8;
}
.button{
    display:inline-block;
    margin:25px 0;
    padding:14px 32px;
    background:#2563eb;
    color:#ffffff !important;
    text-decoration:none;
    border-radius:6px;
    font-size:16px;
    font-weight:bold;
}
.footer{
    background:#f8f9fa;
    text-align:center;
    padding:20px;
    color:#777;
    font-size:13px;
}
</style>
</head>

<body>

<div class="container">

    <div class="header">
        <h2>AI Code Tracker</h2>
    </div>

    <div class="content">

        <h2>Verify Your Account</h2>

        <p>Hello <strong>${username}</strong>,</p>

        <p>
            Thanks for signing up for <strong>AI Code Tracker</strong>.
            Please verify your email address to activate your account.
        </p>

        <a href="${verificationURL}" class="button">
            Verify Account
        </a>

        <p>
            This verification link will expire in
            <strong>15 minutes</strong>.
        </p>

        <p>
            <strong>If you did not create this account, simply ignore this email.</strong>
        </p>

    </div>

    <div class="footer">
        © ${new Date().getFullYear()} AI Code Tracker. All rights reserved.
    </div>

</div>

</body>
</html>
`;
};