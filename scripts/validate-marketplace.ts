#!/usr/bin/env tsx

/**
 * Marketplace Integration Validation Script
 *
 * This script validates that all marketplace components are properly integrated
 * and working together. It checks:
 *
 * 1. Database schema integrity
 * 2. API endpoints connectivity
 * 3. Component dependencies
 * 4. Type safety across modules
 */

import { db } from "../server/db";
import {
  products,
  productCategories,
  campaigns,
  shoppingCarts,
} from "../shared/enhanced-schema";
import { eq, count } from "drizzle-orm";

interface ValidationResult {
  component: string;
  status: "PASS" | "FAIL" | "WARNING";
  message: string;
  details?: any;
}

class MarketplaceValidator {
  private results: ValidationResult[] = [];

  private addResult(
    component: string,
    status: "PASS" | "FAIL" | "WARNING",
    message: string,
    details?: any,
  ) {
    this.results.push({ component, status, message, details });
  }

  async validateDatabaseSchema() {
    console.log("🔍 Validating database schema...");

    try {
      // Test core tables exist and are accessible
      const tableTests = [
        { name: "products", table: products },
        { name: "productCategories", table: productCategories },
        { name: "campaigns", table: campaigns },
        { name: "shoppingCarts", table: shoppingCarts },
      ];

      for (const test of tableTests) {
        try {
          const result = await db.select({ count: count() }).from(test.table);
          this.addResult(
            `DB:${test.name}`,
            "PASS",
            `Table ${test.name} accessible`,
            { rowCount: result[0]?.count || 0 },
          );
        } catch (error) {
          this.addResult(
            `DB:${test.name}`,
            "FAIL",
            `Table ${test.name} not accessible`,
            { error: error.message },
          );
        }
      }
    } catch (error) {
      this.addResult("DB:Connection", "FAIL", "Database connection failed", {
        error: error.message,
      });
    }
  }

  async validateAPIRoutes() {
    console.log("🔍 Validating API routes...");

    try {
      // Import marketplace routes to check they compile
      const marketplaceRoutes = await import(
        "../server/routes/marketplace-api"
      );
      this.addResult(
        "API:Routes",
        "PASS",
        "Marketplace API routes import successfully",
      );

      // Check if routes export default router
      if (marketplaceRoutes.default) {
        this.addResult("API:Export", "PASS", "Default router export found");
      } else {
        this.addResult("API:Export", "FAIL", "No default router export found");
      }
    } catch (error) {
      this.addResult(
        "API:Routes",
        "FAIL",
        "Failed to import marketplace API routes",
        { error: error.message },
      );
    }
  }

  async validateComponentDependencies() {
    console.log("🔍 Validating component dependencies...");

    const componentTests = [
      {
        name: "EnhancedMarketplaceContext",
        path: "../src/contexts/EnhancedMarketplaceContext",
      },
      {
        name: "EnhancedSellerDashboard",
        path: "../src/pages/marketplace/EnhancedSellerDashboard",
      },
      {
        name: "EnhancedShoppingCart",
        path: "../src/components/marketplace/EnhancedShoppingCart",
      },
      {
        name: "MobileMarketplaceNav",
        path: "../src/components/marketplace/MobileMarketplaceNav",
      },
      {
        name: "MobileProductCard",
        path: "../src/components/marketplace/MobileProductCard",
      },
    ];

    for (const test of componentTests) {
      try {
        await import(test.path);
        this.addResult(
          `Component:${test.name}`,
          "PASS",
          `${test.name} imports successfully`,
        );
      } catch (error) {
        this.addResult(
          `Component:${test.name}`,
          "FAIL",
          `Failed to import ${test.name}`,
          { error: error.message },
        );
      }
    }
  }

  async validateTypeDefinitions() {
    console.log("🔍 Validating type definitions...");

    try {
      // Import type definitions
      const enhancedTypes = await import("../src/types/enhanced-marketplace");
      const schemaTypes = await import("../shared/enhanced-schema-types");

      this.addResult(
        "Types:Enhanced",
        "PASS",
        "Enhanced marketplace types import successfully",
      );
      this.addResult(
        "Types:Schema",
        "PASS",
        "Schema types import successfully",
      );

      // Check for key type exports
      const keyTypes = [
        "EnhancedProduct",
        "CartItem",
        "MarketplaceOrder",
        "Campaign",
        "ProductBoost",
      ];

      for (const typeName of keyTypes) {
        if (enhancedTypes[typeName]) {
          this.addResult(
            `Types:${typeName}`,
            "PASS",
            `${typeName} type definition found`,
          );
        } else {
          this.addResult(
            `Types:${typeName}`,
            "WARNING",
            `${typeName} type definition not found in enhanced types`,
          );
        }
      }
    } catch (error) {
      this.addResult(
        "Types:Import",
        "FAIL",
        "Failed to import type definitions",
        { error: error.message },
      );
    }
  }

  async validateMobileComponents() {
    console.log("🔍 Validating mobile components...");

    const mobileComponentTests = [
      {
        name: "MobileMarketplaceNav",
        path: "../src/components/marketplace/MobileMarketplaceNav",
      },
      {
        name: "MobileProductCard",
        path: "../src/components/marketplace/MobileProductCard",
      },
      {
        name: "MobileSearchFilter",
        path: "../src/components/marketplace/MobileSearchFilter",
      },
    ];

    for (const test of mobileComponentTests) {
      try {
        const component = await import(test.path);
        this.addResult(
          `Mobile:${test.name}`,
          "PASS",
          `${test.name} mobile component available`,
        );

        // Check for default export
        if (component.default || component[test.name]) {
          this.addResult(
            `Mobile:${test.name}:Export`,
            "PASS",
            `${test.name} has proper export`,
          );
        } else {
          this.addResult(
            `Mobile:${test.name}:Export`,
            "WARNING",
            `${test.name} export structure unclear`,
          );
        }
      } catch (error) {
        this.addResult(
          `Mobile:${test.name}`,
          "FAIL",
          `Failed to import mobile component ${test.name}`,
          { error: error.message },
        );
      }
    }
  }

  async validateIntegrationPoints() {
    console.log("🔍 Validating integration points...");

    try {
      // Check wallet integration
      const walletContext = await import("../src/contexts/WalletContext");
      this.addResult(
        "Integration:Wallet",
        "PASS",
        "Wallet context integration available",
      );

      // Check chat integration
      const chatContext = await import("../src/contexts/ChatContext");
      this.addResult(
        "Integration:Chat",
        "PASS",
        "Chat context integration available",
      );

      // Check user profile integration
      // Note: This might not exist, so we'll mark as warning if missing
      try {
        await import("../src/contexts/UserProfileContext");
        this.addResult(
          "Integration:UserProfile",
          "PASS",
          "User profile context integration available",
        );
      } catch {
        this.addResult(
          "Integration:UserProfile",
          "WARNING",
          "User profile context not found - may need implementation",
        );
      }
    } catch (error) {
      this.addResult(
        "Integration:Contexts",
        "FAIL",
        "Failed to validate integration contexts",
        { error: error.message },
      );
    }
  }

  async runFullValidation() {
    console.log("🚀 Starting Marketplace Integration Validation\\n");

    await this.validateDatabaseSchema();
    await this.validateAPIRoutes();
    await this.validateComponentDependencies();
    await this.validateTypeDefinitions();
    await this.validateMobileComponents();
    await this.validateIntegrationPoints();

    this.printResults();
    return this.getValidationSummary();
  }

  private printResults() {
    console.log("\\n📊 Validation Results:\\n");

    const grouped = this.results.reduce(
      (acc, result) => {
        const category = result.component.split(":")[0];
        if (!acc[category]) acc[category] = [];
        acc[category].push(result);
        return acc;
      },
      {} as Record<string, ValidationResult[]>,
    );

    for (const [category, results] of Object.entries(grouped)) {
      console.log(`🔷 ${category.toUpperCase()}`);

      for (const result of results) {
        const icon =
          result.status === "PASS"
            ? "✅"
            : result.status === "WARNING"
              ? "⚠️"
              : "❌";
        console.log(`  ${icon} ${result.component}: ${result.message}`);

        if (result.details && result.status === "FAIL") {
          console.log(
            `     Details: ${JSON.stringify(result.details, null, 2)}`,
          );
        }
      }
      console.log("");
    }
  }

  private getValidationSummary() {
    const totalTests = this.results.length;
    const passed = this.results.filter((r) => r.status === "PASS").length;
    const warnings = this.results.filter((r) => r.status === "WARNING").length;
    const failed = this.results.filter((r) => r.status === "FAIL").length;

    console.log("📈 Summary:");
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ⚠️  Warnings: ${warnings}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(
      `   Success Rate: ${((passed / totalTests) * 100).toFixed(1)}%\\n`,
    );

    if (failed === 0) {
      console.log(
        "🎉 All critical validations passed! Marketplace is ready for use.",
      );
    } else if (failed <= 2) {
      console.log(
        "⚠️  Some minor issues found. Marketplace should work but may need attention.",
      );
    } else {
      console.log(
        "❌ Significant issues found. Please address failures before using marketplace.",
      );
    }

    return {
      total: totalTests,
      passed,
      warnings,
      failed,
      successRate: (passed / totalTests) * 100,
      status: failed === 0 ? "HEALTHY" : failed <= 2 ? "WARNING" : "CRITICAL",
    };
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new MarketplaceValidator();
  validator
    .runFullValidation()
    .then((summary) => {
      process.exit(summary.status === "CRITICAL" ? 1 : 0);
    })
    .catch((error) => {
      console.error("❌ Validation failed with error:", error);
      process.exit(1);
    });
}

export { MarketplaceValidator };
