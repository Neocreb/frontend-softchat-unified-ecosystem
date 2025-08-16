import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting backend server...');
console.log('📁 Current directory:', process.cwd());
console.log('🔧 Node version:', process.version);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend build (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
}

// Basic API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Auth routes placeholder
app.post('/api/auth/signin', (req, res) => {
  res.json({ success: true, message: 'Sign in endpoint - placeholder' });
});

app.post('/api/auth/signup', (req, res) => {
  res.json({ success: true, message: 'Sign up endpoint - placeholder' });
});

// Posts routes placeholder
app.get('/api/posts', (req, res) => {
  res.json({ posts: [], message: 'Posts endpoint - placeholder' });
});

app.post('/api/posts', (req, res) => {
  res.json({ success: true, message: 'Create post endpoint - placeholder' });
});

// Products routes placeholder
app.get('/api/products', (req, res) => {
  res.json({ products: [], message: 'Products endpoint - placeholder' });
});

// Catch-all handler: send back the frontend's index.html file (only in production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
} else {
  // In development, just return a simple message for non-API routes
  app.get('*', (req, res) => {
    res.json({
      message: 'Backend API server running in development mode',
      frontend: 'Served by Vite on port 8080',
      api: 'Available at /api/*'
    });
  });
}

console.log(`🔄 Attempting to start server on port ${PORT}...`);

app.listen(PORT, () => {
  console.log(`✅ Backend server successfully started!`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${join(__dirname, '../dist')}`);
  console.log(`🌐 API endpoints available at: http://localhost:${PORT}/api`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  console.error('🔍 Error details:', err.message);
  process.exit(1);
});
