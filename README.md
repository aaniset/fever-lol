# 🎉 fever.lol - Open Source Event Management Platform

## 🚀 Overview

fever.lol is a modern, open-source event management and ticketing platform built with Next.js 14. Create, manage, and host events with zero platform fees and complete control over your event experience.

### ✨ Key Features

- 🎫 **Event Creation & Management**

  - Custom event pages with dynamic backgrounds
  - Multiple ticket types and pricing tiers
  - Flexible timing and capacity management
  - Venue selection and management

- 💳 **Payment Processing**

  - Secure payments via Razorpay
  - USD and INR support
  - Customizable payment gateway fees
  - Promo code system

- 📱 **Attendee Experience**

  - QR code ticket validation
  - Real-time check-in system
  - Mobile-responsive design
  - Automated email notifications

- 🏢 **Organizer Tools**
  - Comprehensive dashboard
  - Attendee management and tracking
  - Dynamic promo codes
  - Event status control

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Auth:** NextAuth.js with Google OAuth
- **Database:** MongoDB
- **Storage:** AWS S3
- **UI:** shadcn/ui + Tailwind CSS
- **Email:** Resend
- **Payments:** Razorpay

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose (for containerized deployment)
- MongoDB database
- AWS S3 bucket
- Razorpay account
- Google OAuth credentials

### Installation

1. Clone the repository:

```bash
git clone https://github.com/aaniset/fever.lol.git
cd fever.lol
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

### 🐳 Docker Deployment

1. Build and run with Docker Compose:

```bash
docker-compose up -d --build
```

2. Access the application at `http://localhost:3000`

## 🔒 Environment Variables

```env
# Application
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV=development
MONGODB_URI="mongodb://localhost:27017/fever-lol"

# Authentication
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
NEXTAUTH_SECRET=""
ENCRYPTION_KEY=""

# AWS
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
AWS_BUCKET=""

# Email
EMAIL_SERVER_PASSWORD=""
AUTH_RESEND_KEY=""
EMAIL_SERVER_USER=resend
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=465
EMAIL_FROM=""
```

## 📁 Project Structure

```
fever.lol/
├── app/
│   ├── api/         # API routes
│   ├── auth/        # Authentication
│   ├── dashboard/   # Dashboard pages
│   └── events/      # Event pages
├── components/      # UI components
├── contexts/        # React contexts
├── lib/            # Utility functions
├── models/         # Data models
└── public/         # Static assets
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

- Website: [fever.lol](https://fever.lol)
- Email: hello@fever.lol

---

Built with ❤️ by [Anudeep](https://github.com/aaniset)
