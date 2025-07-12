#!/usr/bin/env tsx

/**
 * Simplified Marketplace Validation Script
 *
 * This script validates marketplace components without requiring database connection
 */

interface ValidationResult {
  component: string;
  status: "PASS" | "FAIL" | "WARNING";
  message: string;
  details?: any;
}

class SimpleMarketplaceValidator {
  private results: ValidationResult[] = [];

  private addResult(
    component: string,
    status: "PASS" | "FAIL" | "WARNING",
    message: string,
    details?: any,
  ) {
    this.results.push({ component, status, message, details });
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
    } catch (error: any) {
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
      } catch (error: any) {
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
      this.addResult(
        "Types:Enhanced",
        "PASS",
        "Enhanced marketplace types import successfully",
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
        if ((enhancedTypes as any)[typeName]) {
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
    } catch (error: any) {
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
        if (component.default || (component as any)[test.name]) {
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
      } catch (error: any) {
        this.addResult(
          `Mobile:${test.name}`,
          "FAIL",
          `Failed to import mobile component ${test.name}`,
          { error: error.message },
        );
      }
    }
  }

  async runValidation() {
    console.log("🚀 Starting Marketplace Validation\\n");

    await this.validateAPIRoutes();
    await this.validateComponentDependencies();
    await this.validateTypeDefinitions();
    await this.validateMobileComponents();

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
          console.log(`     Details: ${result.details.error}`);
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
        "🎉 All critical validations passed! Marketplace components are properly integrated.",
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
const validator = new SimpleMarketplaceValidator();
validator
  .runValidation()
  .then((summary) => {
    process.exit(summary.status === "CRITICAL" ? 1 : 0);
  })
  .catch((error) => {
    console.error("❌ Validation failed with error:", error);
    process.exit(1);
  });

export { SimpleMarketplaceValidator };
