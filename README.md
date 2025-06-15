# AI-Powered Enterprise HRMS System

## Overview of the System and Its Features

A comprehensive Human Resource Management System powered by artificial intelligence to streamline HR operations and enhance decision-making.

### Core Features
- **Employee Management**: Complete employee lifecycle management with profiles, onboarding, and offboarding
- **Attendance Tracking**: Real-time clock in/out system with timesheet management
- **Leave Management**: Automated leave requests, approvals, and balance tracking
- **Payroll Processing**: Automated salary calculations, deductions, and payroll reports
- **Performance Management**: Goal setting, performance reviews, and evaluation tracking
- **Department Management**: Organizational structure and hierarchy management

### AI-Powered Features
- **Smart Recruitment**: AI-assisted candidate screening and ranking
- **Performance Analytics**: AI-driven insights into employee performance patterns
- **Predictive Analytics**: Employee retention and satisfaction predictions
- **Automated Reporting**: AI-generated HR reports and insights
- **Intelligent Notifications**: Smart alerts and reminders based on HR events

## Instructions for Setting Up the Project Locally

### Prerequisites
- Node.js (version 18 or higher)
- npm (version 8 or higher)
- PostgreSQL database
- Redis server

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd ai-hrms
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   - Copy `backend/env.example` to `backend/.env`
   - Copy `frontend/env.example` to `frontend/.env.local`
   - Update the environment files with your database, Redis, and API keys

4. **Set up the database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: ai-hrms-frontend-production.up.railway.app
   - Backend API: ai-hrms-backend-production.up.railway.app/api



## Screenshots or Video Demo

*Add screenshots or video demo of your application here*

## Stack Used and AI Models/APIs Implemented

### Frontend Stack
- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **React Router** for navigation
- **React Query** for state management

### Backend Stack
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** with Prisma ORM
- **Redis** for caching and sessions
- **Socket.io** for real-time features
- **JWT** for authentication

### AI Models/APIs
- **OpenAI GPT API** for intelligent text processing and insights
- **OpenAI Embeddings** for document similarity and search
- **Custom ML models** for performance prediction
- **Natural Language Processing** for resume parsing and analysis

## Notes on Scaling or Deployment Architecture

### Scalability Features
- **Microservices Architecture**: Backend designed as modular services
- **Database Optimization**: Indexed queries and connection pooling
- **Caching Strategy**: Redis for session management and frequently accessed data
- **Load Balancing**: Ready for horizontal scaling with multiple server instances

### Deployment Options
- **Railway**: Full-stack deployment with automatic CI/CD
- **Vercel + Railway**: Frontend on Vercel, Backend on Railway
- **Docker**: Containerized deployment for any cloud provider
- **Traditional VPS**: Manual deployment on virtual private servers

### Performance Considerations
- **API Rate Limiting**: Prevents abuse and ensures fair usage
- **Database Connection Pooling**: Efficient database resource management
- **Static Asset Optimization**: Compressed and cached frontend assets
- **Real-time Updates**: WebSocket connections for live data synchronization

## .env.example File for Local Configuration

### Backend Environment Variables (`backend/env.example`)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ai_hrms"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key"
OPENAI_API_KEY="your-openai-api-key"
NODE_ENV="development"
PORT=3001
```

### Frontend Environment Variables (`frontend/env.example`)
```env
VITE_API_BASE_URL="http://localhost:3001/api"
VITE_APP_NAME="AI HRMS"
VITE_ENABLE_AI_FEATURES="true"
```

## Backend Hosted Link (if separate)

🔗 **Backend API**: [Your Backend API URL Here]

📚 **API Documentation**: [Your API Docs URL Here] 