/**
 * SoftChat Comprehensive Platform API Documentation
 *
 * This file provides comprehensive API documentation for all modules
 * of the SoftChat platform including authentication, freelance, marketplace,
 * P2P trading, wallet management, boost system, and admin operations.
 */

export const apiDocumentation = {
  openapi: "3.0.0",
  info: {
    title: "SoftChat Comprehensive Platform API",
    version: "1.0.0",
    description: `
      Complete API documentation for SoftChat - A unified platform combining:
      - Social networking and chat
      - Freelance marketplace
      - P2P cryptocurrency trading
      - E-commerce marketplace
      - Wallet and escrow system
      - Premium subscriptions and boost system
      - Multi-admin role-based dashboard
    `,
    contact: {
      name: "SoftChat API Support",
      email: "api-support@softchat.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },

  servers: [
    {
      url: "/api/v1",
      description: "Production API v1",
    },
    {
      url: "/api",
      description: "Admin API",
    },
  ],

  tags: [
    {
      name: "Authentication",
      description: "User registration, login, and session management",
    },
    {
      name: "Wallet",
      description: "Multi-currency wallet operations and transactions",
    },
    {
      name: "Freelance",
      description:
        "Job posting, proposals, projects, and freelance marketplace",
    },
    {
      name: "Marketplace",
      description: "Product listings, orders, and e-commerce operations",
    },
    {
      name: "P2P Trading",
      description: "Peer-to-peer cryptocurrency trading",
    },
    {
      name: "Chat",
      description: "Unified messaging system across all modules",
    },
    {
      name: "Boost System",
      description: "Content promotion and advertising system",
    },
    {
      name: "Premium",
      description: "Premium subscriptions and membership tiers",
    },
    {
      name: "Admin",
      description: "Administrative operations and dashboard",
    },
    {
      name: "Escrow",
      description: "Secure payment and fund management",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      adminAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Admin-level JWT token with elevated privileges",
      },
    },

    schemas: {
      // Authentication Schemas
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
          twoFactorCode: { type: "string" },
        },
      },

      RegisterRequest: {
        type: "object",
        required: ["email", "password", "fullName"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
          fullName: { type: "string" },
          username: { type: "string" },
        },
      },

      // Wallet Schemas
      WalletBalance: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          usdtBalance: { type: "string" },
          ethBalance: { type: "string" },
          btcBalance: { type: "string" },
          softPointsBalance: { type: "string" },
          isFrozen: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
        },
      },

      SendMoneyRequest: {
        type: "object",
        required: ["recipientId", "amount", "currency"],
        properties: {
          recipientId: { type: "string" },
          amount: { type: "number", minimum: 0.01 },
          currency: {
            type: "string",
            enum: ["USDT", "ETH", "BTC", "SOFT_POINTS"],
          },
          description: { type: "string" },
        },
      },

      // Freelance Schemas
      FreelanceJob: {
        type: "object",
        properties: {
          id: { type: "string" },
          clientId: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          category: { type: "string" },
          budgetType: { type: "string", enum: ["fixed", "hourly"] },
          budgetMin: { type: "number" },
          budgetMax: { type: "number" },
          budgetAmount: { type: "number" },
          deadline: { type: "string", format: "date-time" },
          experienceLevel: {
            type: "string",
            enum: ["entry", "intermediate", "expert"],
          },
          skills: {
            type: "array",
            items: { type: "string" },
          },
          status: {
            type: "string",
            enum: ["open", "in-progress", "completed", "cancelled"],
          },
          applicationsCount: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
        },
      },

      JobProposal: {
        type: "object",
        required: [
          "coverLetter",
          "proposedRateType",
          "proposedAmount",
          "deliveryTime",
        ],
        properties: {
          coverLetter: { type: "string" },
          proposedRateType: { type: "string", enum: ["fixed", "hourly"] },
          proposedAmount: { type: "number", minimum: 1 },
          deliveryTime: { type: "string" },
          milestones: { type: "array" },
          attachments: {
            type: "array",
            items: { type: "string" },
          },
        },
      },

      // P2P Trading Schemas
      P2PTradeOffer: {
        type: "object",
        required: [
          "offerType",
          "cryptoType",
          "amount",
          "pricePerUnit",
          "paymentMethod",
        ],
        properties: {
          offerType: { type: "string", enum: ["buy", "sell"] },
          cryptoType: { type: "string", enum: ["USDT", "ETH", "BTC"] },
          amount: { type: "number", minimum: 0.01 },
          pricePerUnit: { type: "number", minimum: 0.01 },
          paymentMethod: { type: "string" },
          notes: { type: "string" },
          expiresAt: { type: "string", format: "date-time" },
        },
      },

      P2PTrade: {
        type: "object",
        properties: {
          id: { type: "string" },
          offerId: { type: "string" },
          buyerId: { type: "string" },
          sellerId: { type: "string" },
          cryptoType: { type: "string" },
          amount: { type: "string" },
          pricePerUnit: { type: "string" },
          totalAmount: { type: "string" },
          paymentMethod: { type: "string" },
          status: {
            type: "string",
            enum: [
              "pending",
              "payment_pending",
              "payment_confirmed",
              "completed",
              "cancelled",
              "disputed",
            ],
          },
          paymentDeadline: { type: "string", format: "date-time" },
          releaseDeadline: { type: "string", format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
        },
      },

      // Marketplace Schemas
      Product: {
        type: "object",
        properties: {
          id: { type: "string" },
          sellerId: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "string" },
          discountPrice: { type: "string" },
          category: { type: "string" },
          imageUrl: { type: "string" },
          inStock: { type: "boolean" },
          isFeatured: { type: "boolean" },
          rating: { type: "string" },
          reviewCount: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
        },
      },

      CreateOrderRequest: {
        type: "object",
        required: ["items", "shippingAddress", "paymentMethod"],
        properties: {
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                productId: { type: "string" },
                quantity: { type: "integer", minimum: 1 },
              },
            },
          },
          shippingAddress: {
            type: "object",
            properties: {
              name: { type: "string" },
              address: { type: "string" },
              city: { type: "string" },
              state: { type: "string" },
              zipCode: { type: "string" },
              country: { type: "string" },
            },
          },
          paymentMethod: {
            type: "string",
            enum: ["wallet", "USDT", "soft_points"],
          },
        },
      },

      // Boost System Schemas
      BoostRequest: {
        type: "object",
        required: [
          "type",
          "referenceId",
          "boostType",
          "duration",
          "paymentMethod",
        ],
        properties: {
          type: {
            type: "string",
            enum: ["freelance_job", "product", "post", "profile"],
          },
          referenceId: { type: "string" },
          boostType: {
            type: "string",
            enum: ["featured", "top_listing", "premium_placement", "highlight"],
          },
          duration: { type: "integer", minimum: 1 }, // Hours
          paymentMethod: {
            type: "string",
            enum: ["USDT", "soft_points"],
          },
        },
      },

      // Premium Subscription Schemas
      PremiumSubscriptionRequest: {
        type: "object",
        required: ["tier", "billingType"],
        properties: {
          tier: { type: "string", enum: ["silver", "gold", "pro"] },
          billingType: { type: "string", enum: ["monthly", "yearly"] },
        },
      },

      // Chat Schemas
      ChatThread: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: {
            type: "string",
            enum: [
              "freelance",
              "marketplace",
              "p2p_trade",
              "social",
              "support",
            ],
          },
          referenceId: { type: "string" },
          participants: {
            type: "array",
            items: { type: "string" },
          },
          title: { type: "string" },
          isGroup: { type: "boolean" },
          lastMessageAt: { type: "string", format: "date-time" },
          messageCount: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
        },
      },

      SendMessageRequest: {
        type: "object",
        required: ["threadId", "content"],
        properties: {
          threadId: { type: "string" },
          content: { type: "string" },
          messageType: {
            type: "string",
            enum: ["text", "image", "file", "audio", "video"],
          },
          attachments: { type: "array" },
          replyToId: { type: "string" },
        },
      },

      // Error Schemas
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: { type: "string" },
          code: { type: "string" },
          details: { type: "object" },
        },
      },

      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
          data: { type: "object" },
        },
      },
    },
  },

  paths: {
    // Authentication Endpoints
    "/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          400: {
            description: "Invalid input",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "User login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    token: { type: "string" },
                    user: { type: "object" },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // Wallet Endpoints
    "/wallet": {
      get: {
        tags: ["Wallet"],
        summary: "Get wallet balance",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Wallet balance retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    wallet: { $ref: "#/components/schemas/WalletBalance" },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/wallet/send": {
      post: {
        tags: ["Wallet"],
        summary: "Send money to another user",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SendMoneyRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Transfer completed successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          400: {
            description: "Insufficient balance or invalid request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/wallet/history": {
      get: {
        tags: ["Wallet"],
        summary: "Get transaction history",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 50 },
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", default: 0 },
          },
          {
            name: "type",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "currency",
            in: "query",
            schema: {
              type: "string",
              enum: ["USDT", "ETH", "BTC", "SOFT_POINTS"],
            },
          },
        ],
        responses: {
          200: {
            description: "Transaction history retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    transactions: {
                      type: "array",
                      items: { type: "object" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // Freelance Endpoints
    "/jobs": {
      get: {
        tags: ["Freelance"],
        summary: "Get job listings",
        parameters: [
          {
            name: "category",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "experienceLevel",
            in: "query",
            schema: {
              type: "string",
              enum: ["entry", "intermediate", "expert"],
            },
          },
          {
            name: "budgetMin",
            in: "query",
            schema: { type: "number" },
          },
          {
            name: "budgetMax",
            in: "query",
            schema: { type: "number" },
          },
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", default: 0 },
          },
        ],
        responses: {
          200: {
            description: "Job listings retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    jobs: {
                      type: "array",
                      items: { $ref: "#/components/schemas/FreelanceJob" },
                    },
                  },
                },
              },
            },
          },
        },
      },

      post: {
        tags: ["Freelance"],
        summary: "Create job posting",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/FreelanceJob" },
            },
          },
        },
        responses: {
          201: {
            description: "Job created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    job: { $ref: "#/components/schemas/FreelanceJob" },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/jobs/{jobId}/apply": {
      post: {
        tags: ["Freelance"],
        summary: "Apply to job",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "jobId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/JobProposal" },
            },
          },
        },
        responses: {
          201: {
            description: "Proposal submitted successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          409: {
            description: "Already applied to this job",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // P2P Trading Endpoints
    "/p2p/offers": {
      post: {
        tags: ["P2P Trading"],
        summary: "Create P2P trade offer",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/P2PTradeOffer" },
            },
          },
        },
        responses: {
          201: {
            description: "Offer created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          403: {
            description: "KYC verification required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/p2p/trades/{offerId}/start": {
      post: {
        tags: ["P2P Trading"],
        summary: "Start trade from offer",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "offerId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  amount: { type: "number" },
                  paymentMethod: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Trade started successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },

    // Marketplace Endpoints
    "/products": {
      get: {
        tags: ["Marketplace"],
        summary: "Get product listings",
        parameters: [
          {
            name: "category",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "minPrice",
            in: "query",
            schema: { type: "number" },
          },
          {
            name: "maxPrice",
            in: "query",
            schema: { type: "number" },
          },
          {
            name: "featured",
            in: "query",
            schema: { type: "boolean" },
          },
        ],
        responses: {
          200: {
            description: "Product listings retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    products: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" },
                    },
                  },
                },
              },
            },
          },
        },
      },

      post: {
        tags: ["Marketplace"],
        summary: "Create product listing",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Product" },
            },
          },
        },
        responses: {
          201: {
            description: "Product created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },

    "/orders": {
      post: {
        tags: ["Marketplace"],
        summary: "Create order",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateOrderRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Order created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          400: {
            description: "Insufficient balance or invalid order",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // Boost System Endpoints
    "/boost/request": {
      post: {
        tags: ["Boost System"],
        summary: "Request content boost",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BoostRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Boost request submitted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },

    // Premium Subscription Endpoints
    "/premium/subscribe": {
      post: {
        tags: ["Premium"],
        summary: "Subscribe to premium",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PremiumSubscriptionRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Subscription activated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },

    // Admin Endpoints
    "/admin/login": {
      post: {
        tags: ["Admin"],
        summary: "Admin login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                  twoFactorCode: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Admin login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    token: { type: "string" },
                    admin: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/admin/dashboard": {
      get: {
        tags: ["Admin"],
        summary: "Get admin dashboard data",
        security: [{ adminAuth: [] }],
        responses: {
          200: {
            description: "Dashboard data retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    dashboard: {
                      type: "object",
                      properties: {
                        stats: { type: "object" },
                        recentActivity: { type: "array" },
                        systemHealth: { type: "object" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/admin/users": {
      get: {
        tags: ["Admin"],
        summary: "Get users list",
        security: [{ adminAuth: [] }],
        parameters: [
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "status",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "role",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 50 },
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", default: 0 },
          },
        ],
        responses: {
          200: {
            description: "Users list retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    users: { type: "array" },
                    pagination: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default apiDocumentation;
