// Email transporter configuration
import nodemailer from 'nodemailer';
export const createTransporter = () => {
    // Gmail configuration (you can modify for other email providers)
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // your gmail address
            pass: process.env.EMAIL_PASS  // your app password (not regular password)
        }
    });
};