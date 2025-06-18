# Coolify Deployment Checklist

Use this checklist to ensure successful deployment of the AI Compliance Monitoring System on Coolify.

## ✅ Pre-Deployment Checklist

### Repository Setup
- [ ] Repository is accessible from Coolify
- [ ] Main branch contains all latest changes
- [ ] All files are committed and pushed

### Backend Service (ai-compliance-demo)
- [ ] **Service Configuration**
  - [ ] Service name: `ai-compliance-api` (or your preferred name)
  - [ ] Source: Git repository
  - [ ] Branch: `main`
  - [ ] Root Directory: `ai-compliance-demo`

- [ ] **Build Configuration**
  - [ ] Build Command: `docker build -t ai-compliance-api .`
  - [ ] Dockerfile: `ai-compliance-demo/Dockerfile`
  - [ ] Build context: `ai-compliance-demo/`

- [ ] **Environment Variables**
  - [ ] `ENVIRONMENT=production`
  - [ ] `CORS_ORIGINS=https://your-frontend-domain.com` (update with actual domain)

- [ ] **Port Configuration**
  - [ ] Container Port: `8000`
  - [ ] Exposed Port: `8000`

### Frontend Service (UI-main)
- [ ] **Service Configuration**
  - [ ] Service name: `ai-compliance-ui` (or your preferred name)
  - [ ] Source: Git repository
  - [ ] Branch: `main`
  - [ ] Root Directory: `UI-main`

- [ ] **Build Configuration**
  - [ ] Build Command: `docker build -t ai-compliance-ui .`
  - [ ] Dockerfile: `UI-main/Dockerfile`
  - [ ] Build context: `UI-main/`

- [ ] **Environment Variables**
  - [ ] `VITE_API_BASE_URL=https://your-backend-domain.com/api` (update with actual backend domain)
  - [ ] `VITE_ENV=production`

- [ ] **Port Configuration**
  - [ ] Container Port: `80`
  - [ ] Exposed Port: `80`

## 🚀 Deployment Steps

### 1. Deploy Backend First
1. Create new service in Coolify
2. Configure as per checklist above
3. Deploy and verify it's running
4. Test health endpoint: `https://your-backend-domain.com/api/health`

### 2. Deploy Frontend
1. Create new service in Coolify
2. Configure as per checklist above
3. Update `VITE_API_BASE_URL` with your backend domain
4. Deploy and verify it's running

### 3. Verify Deployment
- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] API calls work from frontend
- [ ] CORS is properly configured

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Backend Build Fails
**Issue**: Docker build fails during Poetry installation
**Solution**: ✅ **FIXED** - Updated Dockerfile to use `requirements.txt` instead of Poetry

**Issue**: Python dependencies not found
**Solution**: Ensure `requirements.txt` exists in `ai-compliance-demo/`

#### Frontend Build Fails
**Issue**: Node.js dependencies installation fails
**Solution**: Use `npm install --legacy-peer-deps`

**Issue**: Build output not found
**Solution**: Ensure `npm run build` completes successfully

#### API Connection Issues
**Issue**: CORS errors in browser
**Solution**: 
1. Update `CORS_ORIGINS` in backend environment variables
2. Include your frontend domain in the comma-separated list

**Issue**: API calls fail
**Solution**:
1. Verify `VITE_API_BASE_URL` is correct
2. Ensure backend is accessible from frontend domain
3. Check backend logs for errors

#### Port Issues
**Issue**: Port already in use
**Solution**: 
- Backend uses port 8000
- Frontend uses port 80 (nginx)
- Ensure no conflicts in Coolify configuration

## 📊 Health Check Endpoints

- **Backend Health**: `GET /api/health`
- **Frontend Health**: `GET /health`
- **API Documentation**: `GET /api/docs`

## 🔍 Monitoring

### Logs to Check
- Backend container logs for API errors
- Frontend container logs for build issues
- Nginx logs for routing problems

### Performance Monitoring
- Response times for API endpoints
- Frontend load times
- Memory and CPU usage

## 🛡️ Security Considerations

- [ ] Use HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set secure environment variables
- [ ] Enable health checks for monitoring

## 📞 Support

If deployment fails:
1. Check Coolify logs for specific error messages
2. Verify all checklist items are completed
3. Test locally using `docker-compose up --build`
4. Review the troubleshooting section above

## 🎯 Success Criteria

Deployment is successful when:
- [ ] Both services are running in Coolify
- [ ] Frontend loads at your domain
- [ ] Backend API responds to health checks
- [ ] Frontend can communicate with backend
- [ ] All features work as expected 