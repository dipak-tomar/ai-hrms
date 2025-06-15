# AI-HRMS Railway Deployment Guide

Deploy your complete AI-HRMS application on Railway - frontend, backend, and database all in one platform.

## 🏗️ Architecture Overview

- **Frontend**: React/Vite app on Railway
- **Backend**: Node.js/Express API on Railway  
- **Database**: PostgreSQL on Railway
- **Redis**: Redis instance on Railway (for caching/sessions)
- **File Storage**: Railway persistent volumes

## 📋 Prerequisites

- [Railway](https://railway.app/) account
- [Git](https://git-scm.com/) repository with your code
- [Railway CLI](https://docs.railway.app/develop/cli) installed

## 🚀 Quick Start

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login to Railway

```bash
railway login
```

### 3. Initialize Project

```bash
railway init
```

## 📦 Step-by-Step Deployment

### Step 1: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your AI-HRMS repository
5. Railway will detect it's a monorepo

### Step 2: Add Database Services

#### Add PostgreSQL Database

1. In your Railway project dashboard
2. Click "New Service" → "Database" → "PostgreSQL"
3. Railway automatically creates the database
4. Note the connection details (available as environment variables)

#### Add Redis (Optional but Recommended)

1. Click "New Service" → "Database" → "Redis"  
2. Railway provides Redis connection details
3. Used for caching and session management

### Step 3: Deploy Backend Service

#### Create Backend Service

1. Click "New Service" → "GitHub Repo"
2. Select your repository
3. Set **Root Directory**: `backend`
4. Railway will auto-detect Node.js

#### Configure Backend Environment Variables

In Railway dashboard → Backend Service → Variables:

```env
# Database (automatically provided by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (automatically provided by Railway)  
REDIS_URL=${{Redis.REDIS_URL}}

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=production

# CORS Configuration (will update after frontend deployment)
FRONTEND_URL=https://your-frontend.railway.app
ALLOWED_ORIGINS=https://your-frontend.railway.app

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# AI Features (Optional)
OPENAI_API_KEY=your-openai-api-key
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-pinecone-environment
PINECONE_INDEX_NAME=hrms-knowledge-base

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

#### Configure Backend Build Settings

Railway should auto-detect, but verify:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Install Command**: `npm install`

### Step 4: Deploy Frontend Service

#### Create Frontend Service

1. Click "New Service" → "GitHub Repo"
2. Select your repository  
3. Set **Root Directory**: `frontend`
4. Railway will auto-detect Node.js/Vite

#### Configure Frontend Environment Variables

In Railway dashboard → Frontend Service → Variables:

```env
# API Configuration (use your backend Railway URL)
VITE_API_BASE_URL=https://your-backend.railway.app/api

# App Configuration
VITE_APP_NAME=AI HRMS
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_CHAT_SUPPORT=true
VITE_ENABLE_ANALYTICS=true

# External Services (Optional)
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
VITE_SENTRY_DSN=your-sentry-dsn
```

#### Configure Frontend Build Settings

- **Build Command**: `npm run build`
- **Start Command**: `npm run preview -- --host 0.0.0.0 --port $PORT`
- **Install Command**: `npm install`

### Step 5: Update CORS Configuration

After both services are deployed:

1. Get your frontend Railway URL (e.g., `https://your-frontend.railway.app`)
2. Update backend environment variables:
   ```env
   FRONTEND_URL=https://your-frontend.railway.app
   ALLOWED_ORIGINS=https://your-frontend.railway.app
   ```
3. Redeploy backend service

### Step 6: Database Setup

#### Run Database Migrations

Using Railway CLI:

```bash
# Connect to your backend service
railway link [your-project-id]

# Run migrations
railway run npm run prisma:migrate

# Generate Prisma client
railway run npm run prisma:generate
```

#### Seed Database (Optional)

```bash
railway run npm run prisma:seed
```

## ✅ Verification

### Test Backend Health

Visit: `https://your-backend.railway.app/api/health`

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-XX..."
}
```

### Test Frontend

Visit: `https://your-frontend.railway.app`

The application should load and connect to the backend successfully.

### Test Database Connection

Check Railway logs to ensure database connections are successful.

## 🔧 Advanced Configuration

### Custom Domains

1. Go to Service → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update environment variables with new domain

### Persistent Storage

For file uploads:

1. Go to Service → Settings → Volumes
2. Add a volume (e.g., `/app/uploads`)
3. Update `UPLOAD_PATH` environment variable

### Environment-Specific Deployments

Create separate Railway projects for:
- **Development**: `dev` branch
- **Staging**: `staging` branch  
- **Production**: `main` branch

## 📊 Monitoring and Logs

### View Logs

```bash
# Backend logs
railway logs --service backend

# Frontend logs  
railway logs --service frontend

# Database logs
railway logs --service postgres
```

### Metrics

Railway provides built-in metrics:
- CPU usage
- Memory usage
- Network traffic
- Response times

Access via: Service → Metrics tab

## 🔄 Continuous Deployment

Railway automatically deploys when you push to your connected branch.

### Manual Deployment

```bash
# Deploy specific service
railway up --service backend
railway up --service frontend

# Deploy all services
railway up
```

### Rollback

```bash
# View deployments
railway status

# Rollback to previous deployment
railway rollback [deployment-id]
```

## 🔐 Security Best Practices

1. **Environment Variables**: Use Railway's secure variable storage
2. **Database**: Railway databases are private by default
3. **HTTPS**: Automatic SSL certificates
4. **Secrets**: Never commit sensitive data to Git
5. **Access Control**: Use Railway's team features for collaboration

## 💰 Cost Optimization

- **Resource Limits**: Set appropriate CPU/memory limits
- **Sleep Mode**: Enable for development environments
- **Database**: Choose appropriate PostgreSQL plan
- **Monitoring**: Use Railway's usage dashboard

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   railway logs --service [service-name]
   
   # Verify Node.js version
   # Add to package.json:
   "engines": {
     "node": ">=18.0.0"
   }
   ```

2. **Database Connection Issues**
   ```bash
   # Verify DATABASE_URL
   railway variables --service backend
   
   # Test connection
   railway run npm run prisma:db:push
   ```

3. **CORS Errors**
   - Verify `FRONTEND_URL` and `ALLOWED_ORIGINS`
   - Ensure no trailing slashes in URLs
   - Check browser network tab for exact error

4. **Environment Variables Not Loading**
   - Verify variables are set in Railway dashboard
   - Check variable names (case-sensitive)
   - Restart services after adding variables

### Debug Commands

```bash
# Check service status
railway status

# View environment variables
railway variables

# Connect to service shell
railway shell

# View recent deployments
railway deployments
```

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway CLI Reference](https://docs.railway.app/develop/cli)
- [Prisma Railway Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway)
- [Node.js on Railway](https://docs.railway.app/guides/nodejs)

## 🎯 Production Checklist

- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Custom domains configured (if needed)
- [ ] SSL certificates active
- [ ] Monitoring and alerts set up
- [ ] Backup strategy implemented
- [ ] Team access configured
- [ ] Resource limits set appropriately

---

🎉 **Success!** Your AI-HRMS application is now fully deployed on Railway with frontend, backend, and database all managed in one platform! 