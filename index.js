import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { checkEnv } from 'check-env-sarvesh'
import { validateContactForm } from './src/middleware/validateContactForm.js';
import { contactLimiter } from './src/middleware/rateLimit.js';
import { createTransporter } from './utils/email.js';

// Load environment variables
dotenv.config();
checkEnv(['PORT', 'FRONTEND_URL', 'EMAIL_USER', 'EMAIL_PASS', 'OWNER_EMAIL']);

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:8080',                    // Local development (alternate)
        'https://my-portfolio-five-ruddy-iwfztgv6et.vercel.app',        // Your Vercel frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));



// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Contact form endpoint
app.post('/api/contact', contactLimiter, validateContactForm, async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Create transporter
        const transporter = createTransporter();

        // Verify transporter configuration
        await transporter.verify();

        // Email to you (portfolio owner) - simple notification
        const mailToOwner = {
            from: process.env.EMAIL_USER,
            to: process.env.OWNER_EMAIL || process.env.EMAIL_USER,
            replyTo: email, // This allows you to reply directly to the sender
            subject: `Portfolio Contact: ${name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #00bcd4; padding-bottom: 10px;">
            New Contact from Portfolio
          </h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #00bcd4;">${email}</a></p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 3px; border-left: 4px solid #00bcd4;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e8f5e8; border-radius: 5px;">
            <p style="margin: 0; color: #666;">
              <strong>Received:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            💡 <strong>Tip:</strong> You can reply directly to this email to respond to ${name}
          </p>
        </div>
      `,
            // Plain text version for better deliverability
            text: `
New Contact from Portfolio

Name: ${name}
Email: ${email}

Message:
${message}

Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      `
        };

        // Send only the notification email to you
        await transporter.sendMail(mailToOwner);

        res.status(200).json({
            success: true,
            message: 'Message sent successfully!'
        });

    } catch (error) {
        console.error('Contact form error:', error);

        // Send appropriate error message
        if (error.code === 'EAUTH') {
            res.status(500).json({
                success: false,
                message: 'Email authentication failed. Please try again later.'
            });
        } else if (error.code === 'ECONNECTION') {
            res.status(500).json({
                success: false,
                message: 'Connection failed. Please check your internet connection and try again.'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send message. Please try again later.'
            });
        }
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Portfolio backend server running on port ${PORT}`);
    console.log(`Email service configured for: ${process.env.EMAIL_USER || 'Not configured'}`);
    console.log(`CORS origin: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
});