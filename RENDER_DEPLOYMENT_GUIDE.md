# 🚀 Render Deployment Guide for CodeNotes Backend

This guide will help you deploy your CodeNotes backend to Render.com.

## 📋 Prerequisites

1. **GitHub Repository**: Your code is already pushed to `https://github.com/12jyot/codelisner.git`
2. **Render Account**: Create a free account at [render.com](https://render.com)
3. **MongoDB Atlas**: Set up MongoDB Atlas for production database

## 🔧 Step-by-Step Deployment

### 1. Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster or use existing one
3. **Important**: Add `0.0.0.0/0` to IP whitelist (Network Access → Add IP Address → Allow Access from Anywhere)
4. Create a database user with read/write permissions
5. Get your connection string (should look like): 
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 2. Deploy to Render

1. **Login to Render**: Go to [render.com](https://render.com) and sign in
2. **Connect GitHub**: Link your GitHub account
3. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your repository: `https://github.com/12jyot/codelisner.git`
   - Choose the repository and click "Connect"

4. **Configure Service Settings**:
   - **Name**: `codenotes-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. Set Environment Variables

In Render dashboard, go to your service → Environment tab and add:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://jyoti:nayak%401234@cluster0.zeq4r0u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=codenotes_super_secret_jwt_key_for_production_2024_make_this_very_long_and_random
FRONTEND_URL=https://your-frontend-domain.com
JUDGE0_API_URL=local
JUDGE0_API_KEY=local_execution
CLOUDINARY_CLOUD_NAME=dl09seh2n
CLOUDINARY_API_KEY=248437377427965
CLOUDINARY_API_SECRET=56ulb4pvxwMAHGWZyahP53iRGac
ADMIN_EMAIL=admin@codenotes.com
ADMIN_PASSWORD=admin123
```

### 4. Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Wait for deployment to complete (usually 2-5 minutes)
4. Your backend will be available at: `https://your-service-name.onrender.com`

## 🔗 API Endpoints

Once deployed, your API will be available at:
- Health Check: `https://your-service-name.onrender.com/api/health`
- Tutorials: `https://your-service-name.onrender.com/api/tutorials`
- Auth: `https://your-service-name.onrender.com/api/auth`

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Fails**: Check build logs in Render dashboard
2. **MongoDB Connection**: Ensure IP whitelist includes `0.0.0.0/0`
3. **Environment Variables**: Double-check all required env vars are set
4. **CORS Issues**: Update FRONTEND_URL to your actual frontend domain

### Logs:
- View logs in Render dashboard → Logs tab
- Look for MongoDB connection success: "✅ Connected to MongoDB"

## 🔄 Auto-Deploy

Render automatically deploys when you push to your main branch on GitHub.

## 💰 Pricing

- **Free Tier**: 750 hours/month (enough for development)
- **Paid Plans**: Start at $7/month for always-on services

## 📝 Next Steps

1. Deploy your frontend (React app) to Netlify/Vercel
2. Update FRONTEND_URL environment variable with your frontend domain
3. Test all API endpoints
4. Set up custom domain (optional)

## 🔐 Security Notes

- Never commit sensitive environment variables to GitHub
- Use strong, unique JWT secrets in production
- Regularly rotate API keys and passwords
- Monitor your application logs for security issues
