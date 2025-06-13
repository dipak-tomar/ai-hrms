# AI-Powered Enterprise HRMS System

A comprehensive Human Resource Management System with AI features, built with modern technologies for scalability and performance.

## 🏗️ Architecture

- **Frontend**: React.js with TypeScript, Tailwind CSS, and modern UI components
- **Backend**: Node.js with Express.js, TypeScript, and RESTful APIs
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for sessions and real-time features
- **AI**: OpenAI integration for intelligent HR features
- **Real-time**: Socket.io for live updates and notifications

## 📁 Project Structure

```
ai-hrms/
├── frontend/          # React.js frontend application
├── backend/           # Node.js backend API
├── package.json       # Root package.json with workspace scripts
├── .gitignore         # Git ignore rules for both frontend and backend
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL database
- Redis server

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-hrms
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   **Backend** (`backend/.env`):
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ai_hrms"
   REDIS_URL="redis://localhost:6379"
   JWT_SECRET="your-super-secret-jwt-key"
   OPENAI_API_KEY="your-openai-api-key"
   NODE_ENV="development"
   PORT=3001
   ```

   **Frontend** (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3001/api"
   NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
   ```

4. **Set up the database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start both frontend (http://localhost:3000) and backend (http://localhost:3001)

## 📜 Available Scripts

### Development
- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only frontend development server
- `npm run dev:backend` - Start only backend development server

### Building
- `npm run build` - Build both frontend and backend for production
- `npm run build:frontend` - Build only frontend
- `npm run build:backend` - Build only backend

### Production
- `npm run start` - Start both frontend and backend in production mode
- `npm run start:frontend` - Start only frontend production server
- `npm run start:backend` - Start only backend production server

### Database Management
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset database (⚠️ destructive)

### Testing & Quality
- `npm run test` - Run tests for both frontend and backend
- `npm run lint` - Run linting for both projects
- `npm run type-check` - Run TypeScript type checking

### Utilities
- `npm run install:all` - Install dependencies for both projects
- `npm run clean` - Clean node_modules and build artifacts
- `npm run docker:build` - Build Docker containers
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop Docker containers

## 🔧 Development Workflow

1. **Start development environment**
   ```bash
   npm run dev
   ```

2. **Make changes to frontend or backend**
   - Frontend files are in `frontend/`
   - Backend files are in `backend/`

3. **Database changes**
   ```bash
   # After modifying schema.prisma
   npm run db:migrate
   ```

4. **Testing**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

## 🌟 Features

### Core HRMS Features
- **Employee Management**: Complete employee lifecycle management
- **Attendance Tracking**: Clock in/out, timesheet management
- **Leave Management**: Leave requests, approvals, and tracking
- **Payroll Processing**: Salary calculations, deductions, and reports
- **Performance Management**: Goals, reviews, and evaluations
- **Department Management**: Organizational structure and hierarchies

### AI-Powered Features
- **Smart Recruitment**: AI-assisted candidate screening
- **Performance Insights**: AI-driven performance analytics
- **Predictive Analytics**: Employee retention and satisfaction predictions
- **Automated Reporting**: AI-generated HR reports and insights

### Technical Features
- **Real-time Updates**: Live notifications and data synchronization
- **Role-based Access**: Granular permissions and security
- **Multi-tenant Support**: Support for multiple organizations
- **API-first Design**: RESTful APIs for integrations
- **Responsive Design**: Mobile-friendly interface

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Rate limiting and request validation
- Secure password hashing with bcrypt
- CORS and security headers
- Environment-based configuration

## 📊 Database Schema

The system uses PostgreSQL with the following main entities:
- Users & Authentication
- Companies & Departments
- Employees & Profiles
- Attendance & Time Tracking
- Leave Management
- Payroll & Compensation
- Performance Management
- Notifications & Audit Logs

## 🚀 Deployment

### Vercel + Railway (Recommended)
- Frontend: Deploy to Vercel
- Backend: Deploy to Railway
- Database: Railway PostgreSQL
- Redis: Railway Redis

### Docker
```bash
npm run docker:build
npm run docker:up
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in each project folder
- Review the API documentation at `/api/docs` when running the backend

---

**Happy coding! 🎉** 