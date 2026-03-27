# Deployment Guide

Learn how to deploy COA Study Material to various platforms.

## Build Process

```bash
cd pipeline-site
npm install
npm run build
```

This creates a `dist/` folder with all static files ready for deployment.

## Deployment Platforms

### 1. Vercel (Recommended - Zero Config)

**Easiest way to deploy!**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or connect GitHub repo directly:
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Vercel auto-detects Vite configuration
5. Click "Deploy"

**Automatic deployments** when you push to main branch!

### 2. Netlify

**Simple & user-friendly**

**Option A: GitHub Integration** (Recommended)
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select repository
5. Configure:
   - Base directory: `pipeline-site`
   - Build command: `npm run build`
   - Publish directory: `pipeline-site/dist`
6. Deploy!

**Option B: Manual Upload**
```bash
# Build the project
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=pipeline-site/dist
```

### 3. GitHub Pages

**Free hosting right on GitHub!**

```bash
# Build
npm run build

# Install GitHub Pages package
npm install --save-dev gh-pages

# In package.json, add:
# "homepage": "https://yourusername.github.io/COA_Study_Material-",
# "scripts": {
#   "predeploy": "npm run build",
#   "deploy": "gh-pages -d dist"
# }

# Deploy
npm run deploy
```

### 4. AWS S3 + CloudFront

**For high-traffic production**

```bash
# Install AWS CLI
npm install -g aws-cli

# Configure credentials
aws configure

# Upload to S3
aws s3 sync pipeline-site/dist s3://your-bucket-name/

# Invalidate CloudFront cache (if using CDN)
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

**CloudFront Setup** (for CDN):
1. Create CloudFront distribution
2. Point to S3 bucket origin
3. Set default root object to `index.html`
4. Add error page configuration for SPA routing

### 5. Google Firebase

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize project
firebase init hosting

# Deploy
firebase deploy
```

### 6. Traditional Server (VPS/Dedicated)

```bash
# On your server via SSH

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/yourusername/COA_Study_Material.git
cd COA_Study_Material/pipeline-site

# Install & build
npm install
npm run build

# Option A: Serve with npm packages
npm install -g serve
serve -s dist -l 5173

# Option B: Use Nginx (recommended)
sudo apt install nginx
# Configure nginx.conf to serve dist/
```

**Nginx Configuration** (`/etc/nginx/sites-available/coa`):
```nginx
server {
    listen 80;
    server_name coa.yourdomain.com;
    root /home/user/COA_Study_Material/pipeline-site/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/coa /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### 7. Docker Deployment

**Containerize for consistency**

**Dockerfile**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY pipeline-site/ .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

**Build & Deploy**:
```bash
docker build -t coa-study .
docker run -p 5173:5173 coa-study
```

**Push to Docker Hub**:
```bash
docker tag coa-study yourusername/coa-study
docker push yourusername/coa-study
```

## Environment Configuration

### Environment Variables

Create `.env.production`:
```
VITE_API_URL=https://api.yourdomain.com
VITE_GA_ID=your-google-analytics-id
VITE_ENVIRONMENT=production
```

Reference in code:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

## Performance Optimization

### Before Deployment

```bash
# Analyze bundle size
npm run build -- --analyze

# Check performance
npm run preview
# Test with DevTools > Lighthouse
```

### CDN Configuration

All major platforms include CDN automatically:
- **Vercel**: Automatic global CDN
- **Netlify**: Automatic edge deployment
- **CloudFront**: Configure cache behaviors

### Caching Headers

Set these for optimal performance:
```
# JavaScript/CSS (versioned)
Cache-Control: public, max-age=31536000, immutable

# HTML (not versioned)
Cache-Control: public, max-age=60

# Images
Cache-Control: public, max-age=86400
```

## SSL/TLS Certificates

### Automatic HTTPS
- Vercel: ✅ Built-in
- Netlify: ✅ Built-in (Let's Encrypt)
- GitHub Pages: ✅ Built-in
- Firebase: ✅ Built-in

### Manual (Traditional Servers)
```bash
# Using Let's Encrypt with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
sudo systemctl restart nginx
```

## Monitoring & Analytics

### Google Analytics Setup

1. Create Google Analytics property
2. Get measurement ID
3. Add to VITE_GA_ID environment variable
4. Add to index.html:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Site Monitoring

- **Uptime**: Use UptimeRobot or Pingdom
- **Error Tracking**: Sentry or LogRocket
- **Performance**: New Relic or DataDog
- **Logs**: Cloudflare or AWS CloudWatch

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## Scaling Considerations

### Initial Deployment (< 100k users)
- Single region deployment sufficient
- Vercel/Netlify adequate

### Growth Phase (100k - 1M users)
- Multi-region CDN
- Consider edge functions
- Database for user progress (future)

### Enterprise Scale (> 1M users)
- Global CDN infrastructure
- Load balancing
- Database clustering
- Microservices architecture

## Cost Estimation (Annual)

| Platform | Monthly | Annual | Notes |
|----------|---------|--------|-------|
| Vercel Free | $0 | $0 | Recommended start |
| Netlify Free | $0 | $0 | Good alternative |
| GitHub Pages | $0 | $0 | Static only |
| Firebase Free | $0 | $0 | Good for learning |
| AWS S3+CF | $5-50 | $60-600 | Scales with traffic |
| Dedicated VPS | $5-20 | $60-240 | Full control |

## Rollback Strategy

### Keep Previous Build
```bash
# Tag releases
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Quickly rollback
git checkout v0.9.9
npm run build
# Deploy dist/ again
```

### Blue-Green Deployment
1. Deploy to "green" environment
2. Test thoroughly
3. Switch traffic to green
4. Keep blue as instant rollback

## Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] All pages are accessible
- [ ] Responsive design works (mobile/tablet)
- [ ] Search/filters function
- [ ] Quiz calculation accurate
- [ ] Formulas display correctly
- [ ] Performance acceptable (< 3s load time)
- [ ] SSL certificate valid
- [ ] Analytics tracking works
- [ ] Error logging enabled

---

**Recommended for beginners**: Vercel (simplest)
**Recommended for control**: Traditional VPS + Nginx
**Recommended for scale**: AWS S3 + CloudFront

*Still need help? Check platform-specific docs or open a GitHub issue!*
