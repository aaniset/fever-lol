# 🎉 fever.lol - Open Source Event Management Platform

fever.lol Banner

[License: MIT
[Next.js
[TypeScript
[MongoDB

## 🚀 Overview

fever.lol is a modern, open-source event management and ticketing platform built with Next.js 14. Create, manage, and host events with features like QR code ticketing, attendee management, and integrated payments.

### ✨ Key Features

- 🎫 **Event Creation & Management**

  - Custom event pages
  - Multiple ticket types
  - Capacity management
  - Venue management

- 💳 **Payment Processing**

  - Secure payments via Razorpay
  - Multiple currency support
  - Refund management

- 📱 **Attendee Experience**

  - QR code tickets
  - Email notifications
  - Mobile-responsive design
  - Attendee dashboard

- 🏢 **Organizer Tools**
  - Analytics dashboard
  - Attendee management
  - Discount codes
  - Event insights

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Auth:** NextAuth.js
- **Database:** MongoDB
- **Storage:** AWS S3
- **UI Components:** Radix UI
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Email:** Mailgun
- **Payments:** Razorpay
- **Charts:** Recharts

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- AWS S3 bucket
- Razorpay account
- Mailgun account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fever-lol.git
cd fever-lol
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 📁 Project Structure

```
fever-lol/
├── app/
│   ├── api/         # API routes
│   ├── auth/        # Authentication
│   ├── dashboard/   # Dashboard pages
│   ├── events/      # Event pages
│   └── ...
├── components/      # Reusable components
├── lib/            # Utility functions
├── public/         # Static assets
└── styles/         # Global styles
```

## 🔒 Environment Variables

```env
# Authentication
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Database
MONGODB_URI=

# AWS
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
S3_BUCKET_NAME=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_SECRET=

# Mailgun
MAILGUN_API_KEY=
MAILGUN_DOMAIN=
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- All our amazing contributors!

## 📧 Contact

- Website: [fever.lol](https://fever.lol)
- Email: hello@fever.lol
- Twitter: [@feverlol](https://twitter.com/feverlol)
- Instagram: [@fever.lol](https://instagram.com/fever.lol)

---

Built with ❤️ by the fever.lol team
