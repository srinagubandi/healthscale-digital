# Health Scale Digital

A full-stack website with contact form, admin dashboard, and email/WhatsApp notifications. Designed for easy deployment to Railway via GitHub.

## Features

- **Responsive Website** - Pixel-perfect clone of the original Health Scale Digital site
- **Contact Form** - Captures leads with name, email, phone, company, and message
- **Admin Dashboard** - View, manage, and respond to submissions
- **Email Notifications** - Get notified via email when someone submits the form
- **WhatsApp Notifications** - Get notified via WhatsApp (using Twilio)
- **PostgreSQL Database** - Stores all submissions securely

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Templating**: EJS
- **Email**: Nodemailer (SMTP)
- **WhatsApp**: Twilio API

---

## Deploy to Railway

### Step 1: Fork/Push to GitHub

Make sure this code is in your GitHub repository.

### Step 2: Create Railway Project

1. Go to [Railway](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository

### Step 3: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** then **"Add PostgreSQL"**
3. Railway will automatically set the `DATABASE_URL` environment variable

### Step 4: Configure Environment Variables

In Railway, go to your service then **Variables** tab and add:

#### Required Variables:
```
SESSION_SECRET=<generate-a-random-string>
```

#### Email Notifications (Optional):
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NOTIFICATION_EMAIL=your-email@example.com
```

#### WhatsApp Notifications (Optional):
```
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
WHATSAPP_NOTIFICATION_TO=whatsapp:+1234567890
```

### Step 5: Deploy

Railway will automatically deploy when you push to GitHub. Click **"Deploy"** to trigger manually.

### Step 6: Set Up Admin Account

1. Visit `https://your-app.railway.app/admin/setup`
2. Create your admin username and password
3. You can now access the dashboard at `/admin`

---

## Email Setup

### Gmail (Recommended for Testing)

1. Enable 2-Factor Authentication on your Google account
2. Go to Google App Passwords (myaccount.google.com/apppasswords)
3. Generate an App Password for "Mail"
4. Use this password as `SMTP_PASS`

### SendGrid (Recommended for Production)

1. Create account at SendGrid
2. Create an API key
3. Use these settings:
   - `SMTP_HOST=smtp.sendgrid.net`
   - `SMTP_PORT=587`
   - `SMTP_USER=apikey`
   - `SMTP_PASS=your-api-key`

---

## WhatsApp Setup (Twilio)

### Sandbox Testing

1. Create account at Twilio
2. Go to **Messaging** then **Try it out** then **Send a WhatsApp message**
3. Follow sandbox setup (send "join sandbox-code" to the Twilio number)
4. Use sandbox number: `whatsapp:+14155238886`

### Production

1. Apply for WhatsApp Business API access through Twilio
2. Get a dedicated WhatsApp number
3. Update `TWILIO_WHATSAPP_FROM` with your number

---

## Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file: `cp .env.example .env`
4. Edit `.env` with your database URL and other settings
5. Start the server: `npm run dev`
6. Visit `http://localhost:3000`

---

## Project Structure

```
healthscale-digital/
├── server/
│   ├── index.js          # Main Express server
│   ├── db/
│   │   └── index.js      # Database connection
│   ├── routes/
│   │   ├── api.js        # Contact form API
│   │   └── admin.js      # Admin dashboard routes
│   └── services/
│       ├── email.js      # Email notifications
│       └── whatsapp.js   # WhatsApp notifications
├── views/
│   ├── index.ejs         # Main website
│   ├── 404.ejs           # Error page
│   └── admin/            # Admin dashboard views
├── public/
│   ├── css/styles.css    # Stylesheet
│   ├── js/main.js        # Frontend JavaScript
│   └── images/           # Images and assets
├── package.json
├── railway.json          # Railway configuration
└── .env.example          # Environment template
```

---

## Admin Dashboard

Access the admin dashboard at `/admin`:

- View all submissions with status (new, read, replied, archived)
- See submission details including notification logs
- Update status to track your responses
- Delete submissions when no longer needed
- Reply via email directly from the dashboard

---

## API Endpoints

### POST /api/contact

Submit a contact form.

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Acme Inc",
  "message": "I'd like to learn more about your services."
}
```

Response:
```json
{
  "success": true,
  "message": "Thank you for your message! We will get back to you soon.",
  "submissionId": 1
}
```

---

## License

MIT License - Feel free to use this for your own projects.
