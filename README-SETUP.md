# Development Setup

The app has been fixed and configured properly. Here's how to run it:

## Current Status
✅ Backend server is running on port 5000
✅ API endpoints are working (test: http://localhost:5000/api/health)
✅ Proxy configuration is set up correctly

## What was fixed:
1. **Added missing backend server** - Created `server/enhanced-index.ts` with Express server
2. **Updated package.json scripts** - Added proper backend and build scripts
3. **Configured Vite proxy** - Frontend will proxy API calls to backend on port 5000
4. **Created environment file** - Basic .env setup for configuration

## To access the app:
The dev server is currently running the backend on port 5000. The proxy should now work correctly and the app should be functional through the iframe preview.

## Development Commands:
- `npm run dev` - Runs backend server (port 5000)
- `npm run dev:frontend` - Runs frontend dev server (port 8080) 
- `npm run build:frontend` - Builds frontend for production
- `npm run build` - Builds both frontend and backend

## API Endpoints Available:
- `GET /api/health` - Health check
- `POST /api/auth/signin` - Authentication (placeholder)
- `POST /api/auth/signup` - Registration (placeholder)
- `GET /api/posts` - Get posts (placeholder)
- `POST /api/posts` - Create post (placeholder)
- `GET /api/products` - Get products (placeholder)
