const nodemailer = require('nodemailer');

// Create a transporter object with your SMTP details
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports = {
    sendConfirmationEmail: async (to, token) => {

        // Define the email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: 'Confirmation Email',
            text: `Token: ${token}`
        };
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}