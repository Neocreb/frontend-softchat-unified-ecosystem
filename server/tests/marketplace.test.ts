import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import express from "express";
import { db } from "../db";
import marketplaceApiRoutes from "../routes/marketplace-api";
import {
  products,
  shoppingCarts,
  cartItems,
  marketplaceOrders,
} from "../../shared/enhanced-schema";
import { eq } from "drizzle-orm";

const app = express();
app.use(express.json());
app.use("/api/marketplace", marketplaceApiRoutes);

// Mock authentication middleware
app.use((req, res, next) => {
  req.user = { id: "test-user-id", email: "test@example.com" };
  next();
});

describe("Marketplace API Integration Tests", () => {
  let testProductId: string;

  beforeEach(async () => {
    // Clean up test data
    await db.delete(cartItems);
    await db.delete(shoppingCarts);
    await db.delete(marketplaceOrders);
    await db.delete(products);

    // Create test product
    const [product] = await db
      .insert(products)
      .values({
        sellerId: "test-seller-id",
        name: "Test Product",
        description: "A test product for integration testing",
        price: 29.99,
        discountPrice: null,
        category: "Electronics",
        subcategory: "Test",
        productType: "physical",
        images: ["https://example.com/test-image.jpg"],
        tags: ["test", "electronics"],
        sku: "TEST-001",
        inStock: true,
        stockQuantity: 100,
        minOrderQuantity: 1,
        maxOrderQuantity: 10,
        weight: 1.0,
        dimensions: { length: 10, width: 10, height: 5 },
        shippingClass: "standard",
        status: "active",
        boostLevel: 0,
        averageRating: 0,
        totalReviews: 0,
        totalSales: 0,
        viewCount: 0,
        clickCount: 0,
        favoriteCount: 0,
      })
      .returning();

    testProductId = product.id;
  });

  afterEach(async () => {
    // Clean up test data
    await db.delete(cartItems);
    await db.delete(shoppingCarts);
    await db.delete(marketplaceOrders);
    await db.delete(products);
  });

  describe("Products API", () => {
    it("should fetch products with pagination", async () => {
      const response = await request(app)
        .get("/api/marketplace/products")
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body).toHaveProperty("products");
      expect(response.body).toHaveProperty("pagination");
      expect(Array.isArray(response.body.products)).toBe(true);
      expect(response.body.products.length).toBeGreaterThan(0);
    });

    it("should fetch a single product by ID", async () => {
      const response = await request(app)
        .get(`/api/marketplace/products/${testProductId}`)
        .expect(200);

      expect(response.body.id).toBe(testProductId);
      expect(response.body.name).toBe("Test Product");
      expect(response.body).toHaveProperty("variants");
    });

    it("should create a new product", async () => {
      const newProduct = {
        name: "New Test Product",
        description: "Another test product",
        price: 49.99,
        category: "Fashion",
        subcategory: "Clothing",
        productType: "physical",
        images: ["https://example.com/new-test-image.jpg"],
        tags: ["test", "fashion"],
        sku: "TEST-002",
        inStock: true,
        stockQuantity: 50,
      };

      const response = await request(app)
        .post("/api/marketplace/products")
        .send(newProduct)
        .expect(201);

      expect(response.body.name).toBe(newProduct.name);
      expect(response.body.sellerId).toBe("test-user-id");
    });
  });

  describe("Cart API", () => {
    it("should get or create a cart for user", async () => {
      const response = await request(app)
        .get("/api/marketplace/cart")
        .expect(200);

      expect(response.body).toHaveProperty("cart");
      expect(response.body).toHaveProperty("items");
      expect(Array.isArray(response.body.items)).toBe(true);
    });

    it("should add item to cart", async () => {
      const cartItem = {
        productId: testProductId,
        quantity: 2,
        notes: "Test notes",
      };

      const response = await request(app)
        .post("/api/marketplace/cart/items")
        .send(cartItem)
        .expect(201);

      expect(response.body.productId).toBe(testProductId);
      expect(response.body.quantity).toBe(2);
    });
  });

  describe("Boost API", () => {
    it("should fetch boost options", async () => {
      const response = await request(app)
        .get("/api/marketplace/boost-options")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("price");
      expect(response.body[0]).toHaveProperty("duration");
    });
  });

  describe("Categories API", () => {
    it("should fetch active categories", async () => {
      const response = await request(app)
        .get("/api/marketplace/categories")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("Analytics API", () => {
    it("should fetch seller analytics", async () => {
      const response = await request(app)
        .get("/api/marketplace/seller/analytics")
        .expect(200);

      expect(response.body).toHaveProperty("totalRevenue");
      expect(response.body).toHaveProperty("totalOrders");
      expect(response.body).toHaveProperty("conversionRate");
      expect(response.body).toHaveProperty("monthlyRevenue");
    });
  });
});
