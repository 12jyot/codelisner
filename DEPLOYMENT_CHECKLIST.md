# ✅ Render Deployment Checklist

## 🎯 Quick Deployment Steps

### 1. MongoDB Atlas Setup
- [ ] Go to [MongoDB Atlas](https://cloud.mongodb.com)
- [ ] Add `0.0.0.0/0` to IP whitelist (Network Access → Add IP Address → Allow Access from Anywhere)
- [ ] Copy your connection string: `mongodb+srv://jyoti:nayak%401234@cluster0.zeq4r0u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

### 2. Render Deployment
- [ ] Go to [render.com](https://render.com) and sign up/login
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository: `https://github.com/12jyot/codelisner.git`
- [ ] Configure settings:
  - **Name**: `codenotes-backend`
  - **Environment**: `Node`
  - **Root Directory**: `backend`
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`

### 3. Environment Variables
Add these in Render → Environment tab:

```
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

### 4. Deploy & Test
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (2-5 minutes)
- [ ] Test health endpoint: `https://your-service-name.onrender.com/api/health`
- [ ] Test tutorial endpoint: `https://your-service-name.onrender.com/api/tutorials`

### 5. Update Frontend
- [ ] Update your frontend API base URL to point to your Render backend
- [ ] Deploy your frontend to Netlify/Vercel
- [ ] Update FRONTEND_URL environment variable in Render

## 🚀 Your Backend Will Be Live At:
`https://your-service-name.onrender.com`

## 📞 Support
If you encounter issues, check the deployment guide: `RENDER_DEPLOYMENT_GUIDE.md`
