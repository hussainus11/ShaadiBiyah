# Wedding Planning SaaS Platform

A comprehensive multi-tenant wedding planning SaaS application built with React, Next.js, Node.js, and PostgreSQL.

## 🚀 Features

### Authentication & User Management
- **Role-based Authentication**: Separate registration flows for Users, Vendors, and Admins
- **JWT-based Security**: Secure token-based authentication
- **Email Verification**: Automated email verification system
- **Password Reset**: Secure password reset functionality

### User Dashboard
- **Wedding Countdown**: Days until wedding with progress tracking
- **Budget Tracker**: Real-time budget monitoring and spending analysis
- **Booking Management**: View and manage all wedding bookings
- **Vendor Suggestions**: AI-powered vendor recommendations
- **Wedding Checklist**: Comprehensive planning checklist with progress tracking

### Vendor Dashboard
- **Business Management**: Complete vendor profile and service management
- **Booking Requests**: Real-time booking request handling
- **Analytics**: Revenue tracking and performance metrics
- **Reviews Management**: Customer review and rating system
- **Calendar Integration**: Availability and booking calendar

### Admin Panel
- **User Management**: Approve/reject vendor applications
- **Analytics Dashboard**: Platform-wide analytics and insights
- **Payment Monitoring**: Transaction tracking and management
- **Content Moderation**: Review and moderate platform content

### Marketplace
- **Vendor Discovery**: Category-based vendor listings with advanced filtering
- **Search & Filter**: Location, price, rating-based search
- **Vendor Profiles**: Detailed vendor profiles with galleries and reviews
- **Booking System**: Seamless booking flow with payment integration

### Real-time Chat
- **Socket.io Integration**: Real-time messaging between users and vendors
- **Message Notifications**: Push notifications for new messages
- **Chat History**: Persistent chat history and session management
- **File Sharing**: Support for image and file sharing

### AI Wedding Assistant
- **OpenAI Integration**: GPT-powered wedding planning assistant
- **Personalized Advice**: Context-aware wedding planning suggestions
- **Checklist Generation**: AI-generated wedding planning checklists
- **Budget Estimation**: Intelligent budget breakdown and suggestions
- **Vendor Recommendations**: AI-powered vendor matching

### Payment Integration
- **Stripe Integration**: Secure payment processing
- **Multiple Payment Methods**: Support for various payment options
- **Transaction Management**: Complete payment history and tracking
- **Refund Processing**: Automated refund handling

## 🏗️ Architecture

### Backend (Node.js + Express)
```
backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication, validation, error handling
│   ├── routes/         # API routes
│   ├── socket/         # Socket.io handlers
│   ├── utils/          # Utility functions
│   └── index.ts        # Application entry point
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Database migrations
└── package.json
```

### Frontend (React + Next.js)
```
src/
├── components/
│   ├── dashboard/      # Dashboard components
│   ├── marketplace/    # Marketplace components
│   ├── ui/            # Reusable UI components
│   └── ...
├── pages/             # Next.js pages
├── styles/            # Global styles
└── ...
```

### Database Schema
- **Users**: User profiles and authentication
- **Vendors**: Vendor business information
- **Services**: Vendor service offerings
- **Bookings**: Booking requests and management
- **Payments**: Payment transactions
- **Messages**: Real-time chat messages
- **Reviews**: Customer reviews and ratings
- **Notifications**: System notifications

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Stripe** - Payment processing
- **OpenAI API** - AI integration
- **Nodemailer** - Email service

### Frontend
- **React** - UI library
- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ShadCN UI** - Component library
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd wedding-saas
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../src
npm install
```

4. **Set up environment variables**
```bash
# Backend
cp backend/env.example backend/.env
# Edit backend/.env with your configuration

# Frontend
cp .env.example .env.local
# Edit .env.local with your configuration
```

5. **Set up the database**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

6. **Start the development servers**
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
npm run dev
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/wedding_saas"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRE="30d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
OPENAI_API_KEY="sk-your-openai-api-key"
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_SOCKET_URL="http://localhost:5000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get dashboard data
- `GET /api/users/bookings` - Get user bookings

### Vendors
- `GET /api/vendors` - Get vendors list
- `POST /api/vendors/register` - Vendor registration
- `GET /api/vendors/:id` - Get vendor details
- `PUT /api/vendors/profile` - Update vendor profile

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - Get user bookings
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/history` - Get payment history

### Chat
- `GET /api/chat/sessions` - Get chat sessions
- `POST /api/chat/messages` - Send message
- `GET /api/chat/messages/:sessionId` - Get messages

### AI Assistant
- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/suggest-vendors` - Get vendor suggestions
- `POST /api/ai/create-checklist` - Generate checklist

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - User, Vendor, Admin roles
- **Input Validation** - Zod schema validation
- **Rate Limiting** - API rate limiting
- **CORS Protection** - Cross-origin resource sharing
- **Helmet Security** - Security headers
- **Password Hashing** - bcrypt password hashing

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
npm run build
npm start
```

### Database Migration
```bash
npx prisma migrate deploy
```

## 📊 Monitoring & Analytics

- **User Analytics** - User registration and activity tracking
- **Revenue Analytics** - Payment and booking analytics
- **Performance Metrics** - System performance monitoring
- **Error Tracking** - Error logging and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added AI assistant and enhanced chat
- **v1.2.0** - Improved payment integration and analytics

---

Built with ❤️ for couples planning their perfect wedding day.