const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // Email options 
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;