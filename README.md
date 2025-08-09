A comprehensive AI-powered social media and marketplace platform with crypto trading, freelancing, and advanced analytics features.

## ✨ Features

### 🔐 **Security & Authentication**

- JWT-based authentication with secure password hashing
- Role-based access control (RBAC)
- Rate limiting and DDoS protection
- Input validation and sanitization
- Security headers and CORS protection

### 📁 **File Management**

- AWS S3 integration for file uploads
- Image processing with Sharp (thumbnails, compression)
- Multiple file format support
- CDN-ready asset delivery

### 💳 **Payment Processing**

- Marketplace transactions
- Freelance escrow system
- Subscription management
- Multi-currency support

### 📧 **Communication**

- Professional email templates
- SMTP integration with queuing
- Real-time notifications
- WebSocket messaging

### ⚡ **Performance**

- Redis caching layer
- Background job processing
- Database query optimization
- CDN integration

### 🔍 **Monitoring & Analytics**

- Winston logging system
- Payment analytics
- User engagement metrics
- Error tracking and reporting

### 🎁 **Enhanced Reward System**

- **No Daily Limits**: Content creators can post unlimited content
- **Quality-Based Rewards**: Up to 2.5x multipliers for high-quality content
- **Time-Based Decay**: Natural spam prevention through progressive reward reduction
- **Payment-Gated Rewards**: Marketplace and freelance rewards only on completion
- **Cross-Platform Integration**: Unified SoftPoints system across all activities
- **Anti-Abuse Protection**: AI-powered fraud detection and risk scoring

## 🏗️ Architecture

```
├── server/
│   ├── config/
│   │   └── security.ts          # Security configuration
│   ├── database/
│   │   └── operations.ts        # Database operations
│   ├── routes/
│   │   └── enhanced.ts          # API routes
│   ├── services/
│   │   ├── fileService.ts       # File upload & processing
│   │   ├── emailService.ts      # Email system
│   │   ├── paymentService.ts    # Payment processing
│   │   ├── cacheService.ts      # Redis caching
│   │   └── jobService.ts        # Background jobs
│   ├── enhanced-index.ts        # Enhanced server entry
│   └── db.ts                    # Database connection
├── shared/
│   └── schema.ts                # Database schema
└── scripts/
    └── setup.ts                 # Setup automation
```

## ��� Quick Start

### 1. **Clone & Setup**

```bash
git clone <repository-url>
cd softchat-platform
chmod +x scripts/setup.ts
npx tsx scripts/setup.ts
```

### 2. **Environment Configuration**

```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. **Required Environment Variables**

```bash
# Database (Required)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Security (Required)
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret

# Email (Required for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional but recommended
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=your-bucket
STRIPE_SECRET_KEY=sk_test_...
REDIS_URL=redis://localhost:6379
```

### 4. **Database Setup**

```bash
# Generate and push schema
npm run db:generate
npm run db:push

# View database in Drizzle Studio
npm run db:studio
```

### 5. **Start Development**

```bash
# Start enhanced backend
npm run dev

# Or start original backend
npm run dev:original
```

## 📊 API Endpoints

### **Authentication**

```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
GET  /api/auth/me          # Get current user
```

### **Social Media**

```
GET  /api/posts            # Get feed posts
POST /api/posts            # Create post (with media)
POST /api/posts/:id/like   # Like/unlike post
POST /api/posts/:id/comments # Add comment
```

### **Marketplace**

```
GET  /api/products         # Search products
POST /api/products         # Create product (with images)
POST /api/products/:id/purchase # Purchase product
```

### **Freelancing**

```
GET  /api/freelance/jobs   # Search jobs
POST /api/freelance/jobs   # Post job
POST /api/freelance/jobs/:id/proposals # Submit proposal
```

### **File Uploads**

```
POST /api/upload           # Generic file upload
POST /api/profiles/:id/avatar # Upload avatar
```

### **Real-time**

```
WS   /ws                   # WebSocket connection
```

### **Reward System**

```
POST /api/creator/reward        # Log activity and earn rewards
GET  /api/creator/summary       # Get earnings and statistics
GET  /api/creator/history       # View reward history
GET  /api/creator/leaderboard   # View platform leaderboards
POST /api/creator/withdraw      # Withdraw earnings
```

## 🗄️ Database Schema

### **Core Tables**

- `users` - Authentication data
- `profiles` - User profiles & settings
- `posts` - Social media posts
- `products` - Marketplace items
- `freelance_jobs` - Job postings
- `freelance_projects` - Active contracts
- `notifications` - User notifications

### **Advanced Features**

- `p2p_offers` - Crypto trading
- `freelance_escrow` - Payment security
- `chat_messages` - Real-time messaging
- `project_milestones` - Project tracking

### **Reward System Tables**

- `activity_logs` - All user activities and rewards
- `reward_rules` - Configurable reward parameters
- `trust_scores` - User trust and reputation scores
- `daily_activity_summaries` - Aggregated activity data
- `fraud_detection_logs` - Anti-abuse monitoring

## 🔧 Development

### **Available Scripts**

```bash
npm run dev              # Start enhanced development server
npm run dev:original     # Start original server
npm run build           # Build for production
npm run start           # Start production server
npm run db:push         # Push schema changes
npm run db:studio       # Open database GUI
npm run setup:env       # Copy environment template
```

### **Development Tools**

```bash
# Database operations
npm run db:generate     # Generate migrations
npm run db:push        # Apply schema changes
npm run db:studio      # Database GUI

# Monitoring
npm run logs:view      # View combined logs
npm run logs:errors    # View error logs
```

## 🚀 Production Deployment

### **Build & Deploy**

```bash
# Build application
npm run build

# Deploy to Vercel
npm run deploy:vercel

# Or use Docker
npm run docker:build
npm run docker:run
```

### **Environment Setup**

1. **Database**: Set up Neon Postgres
2. **Storage**: Configure AWS S3 bucket
3. **Email**: Set up SMTP service
4. **Payments**: Configure Stripe account
5. **Cache**: Set up Redis instance
6. **Monitoring**: Configure error tracking

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based auth
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Zod schema validation
- **SQL Injection**: Drizzle ORM protection
- **XSS Protection**: Input sanitization
- **CORS**: Configurable origin policies

## 📈 Performance Optimizations

- **Redis Caching**: Frequently accessed data
- **Background Jobs**: Async processing
- **Image Optimization**: Sharp processing
- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient DB connections

## 🐛 Troubleshooting

### **Common Issues**

**Database Connection**

```bash
# Check DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://user:pass@host:5432/db
```

**File Uploads**

```bash
# Verify AWS credentials
aws s3 ls # Should list buckets
```

**Email Service**

```bash
# Test SMTP connection
npm run test:email
```

**Redis Cache**

```bash
# Check Redis connection
redis-cli ping # Should return PONG
```

### **Debug Mode**

```bash
# Enable debug logging
DEBUG_MODE=true npm run dev
```

## 🎁 Reward System

### **Overview**
Our enhanced reward system encourages authentic engagement through quality-based rewards while preventing abuse through sophisticated time-based decay and risk analysis.

### **Key Features**

#### ✨ **No Daily Limits**
- Content creators can post unlimited content
- Natural rate limiting through progressive decay
- Quality over quantity incentive structure

#### 🏆 **Quality-Based Rewards**
- **Content Quality**: Length, media, engagement features analysis
- **Time Investment**: Up to 2x multiplier for thoughtful content creation
- **Professional Features**: Bonuses for monetized, collaborative content
- **Maximum Multiplier**: Up to 2.5x for exceptional quality

#### ⏰ **Time-Based Decay System**
- **Time Windows**: 4 hours for posts, 24 hours for other activities
- **Progressive Decay**: Starting from 1st action in window
- **Decay Rate**: 0.3 exponential reduction
- **Minimum Rewards**: 0.1x minimum to discourage spam

#### 💳 **Payment-Gated Rewards**
- **Marketplace**: Rewards only on successful payment completion
- **Freelance**: Milestone-based reward distribution
- **P2P Trading**: Rewards on confirmed trade completion
- **Escrow Integration**: Secure reward release mechanisms

### **Activity Rewards**

| Activity | Base Reward | Requirements | Special Features |
|----------|-------------|--------------|------------------|
| **Post Content** | 3 SP | Trust Score 20+ | Quality multipliers up to 2.5x |
| **Marketplace Purchase** | 5 SP + 0.01% | Payment completion | Value-based scaling |
| **Freelance Milestone** | 15 SP | Project completion | Performance bonuses |
| **P2P Trade** | 5 SP | Trade confirmation | Trust-based multipliers |
| **Comment** | 1 SP | Trust Score 10+ | Length and quality analysis |
| **Like/Share** | 0.5-1 SP | Engagement time | Anti-rapid-clicking detection |

### **Anti-Abuse Protection**

#### 🛡️ **Trust Score System**
- **Calculation**: Based on consistency, diversity, quality, behavior
- **Multipliers**: 0.5x to 2.0x based on trust level
- **Requirements**: Minimum trust scores for actions
- **Dynamic**: Updates based on user behavior patterns

#### 🚨 **Risk Analysis**
- **Time-Based Frequency**: Rapid action detection
- **Content Quality**: Pattern analysis for spam
- **Behavioral Analysis**: Session and engagement patterns
- **Fraud Detection**: Automated suspicious activity flagging

#### 🔒 **Security Measures**
- **IP/Device Tracking**: Multi-device abuse prevention
- **Session Analysis**: Behavioral pattern monitoring
- **Content Analysis**: Quality and originality checking
- **Progressive Penalties**: Escalating consequences for abuse

### **Integration Examples**

#### **Marketplace Integration**
```typescript
// Reward only on payment completion
await UnifiedActivityService.trackProductPurchase(
  userId,
  productId,
  amount,
  { paymentStatus: 'completed' }
);
```

#### **Freelance Integration**
```typescript
// Milestone-based rewards
await UnifiedActivityService.trackFreelanceMilestone(
  userId,
  projectId,
  { milestone: completedMilestone, value: milestoneValue }
);
```

#### **Content Creation**
```typescript
// Quality-based post rewards
await UnifiedActivityService.trackPost(
  userId,
  postId,
  {
    contentLength: content.length,
    hasMedia: !!media,
    displayMode: 'both',
    timeSpent: engagementTime
  }
);
```

### **Configuration**
Reward rules are fully configurable through the admin dashboard:
- Base reward amounts
- Decay parameters
- Quality thresholds
- Trust score requirements
- Daily/weekly limits (where applicable)

For detailed technical documentation, see **[Enhanced Reward System](./ENHANCED_REWARD_SYSTEM.md)**

## 📚 Documentation

- **[Backend Implementation Guide](./BACKEND_IMPLEMENTATION_GUIDE.md)** - Complete technical documentation
- **[Enhanced Reward System](./ENHANCED_REWARD_SYSTEM.md)** - Comprehensive reward system documentation
- **[API Documentation](./docs/api.md)** - Detailed API reference
- **[Database Schema](./docs/database.md)** - Schema documentation
- **[Deployment Guide](./docs/deployment.md)** - Production deployment

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the guides in `/docs`
- **Issues**: Report bugs in GitHub Issues
- **Email**: team@softchat.com
- **Discord**: [Join our community](https://discord.gg/softchat)

---

**Built with ❤️ by the Softchat Team**

🌟 **Star this repo if you find it helpful!**
