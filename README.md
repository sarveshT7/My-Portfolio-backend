# Portfolio Backend

A simple Node.js backend service for handling contact form submissions from your portfolio website.

## Features

- 📬 Contact form email notifications
- 🔒 Input validation and security
- ⚡ Rate limiting (5 requests per 15 minutes)
- 🚀 ES Modules support
- 📱 CORS enabled for frontend integration

## Tech Stack

- **Node.js** with ES Modules
- **Express.js** - Web framework
- **Nodemailer** - Email sending
- **Gmail SMTP** - Email delivery

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Gmail credentials
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
OWNER_EMAIL=sarveshtalekar123@gmail.com
FRONTEND_URL=http://localhost:3000
```

### 3. Gmail Setup
1. Enable [2-Factor Authentication](https://myaccount.google.com/security)
2. Generate [App Password](https://myaccount.google.com/apppasswords)
3. Use the 16-character App Password in `EMAIL_PASS`

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### `POST /api/contact`
Submit contact form data.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "message": "Hello, I'd like to discuss a project..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully!"
}
```

### `GET /api/health`
Health check endpoint.


### Railway / Vercel / DigitalOcean
Set environment variables in your deployment platform dashboard.

## 📁 Project Structure

```
portfolio-backend/
├── index.js              # Main server file
├── package.json           # Dependencies & scripts
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🔒 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `EMAIL_USER` | Your Gmail address | `you@gmail.com` |
| `EMAIL_PASS` | Gmail App Password | `abcdefghijklmnop` |
| `OWNER_EMAIL` | Where to receive emails | `sarveshtalekar123@gmail.com` |
| `FRONTEND_URL` | Your frontend URL | `https://yoursite.com` |

## 🧪 Testing

Test your email setup:
```bash
node test-email.js
```

## 🐛 Troubleshooting

**Authentication Error (535):**
- Use App Password, not regular password
- Enable 2-Factor Authentication first

**CORS Error:**
- Check `FRONTEND_URL` matches your React app URL exactly

**Port Error:**
- Change `PORT` in `.env` if 5000 is in use

## 📝 License

MIT License - Feel free to use for your portfolio!

---
