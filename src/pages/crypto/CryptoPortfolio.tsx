import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import EnhancedCryptoPortfolio from "@/components/crypto/EnhancedCryptoPortfolio";

export default function CryptoPortfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header with Back Navigation */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Overview
              </Button>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Crypto Portfolio
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Manage and track your cryptocurrency assets and investments
              </p>
            </div>
          </div>

          {/* Portfolio Content */}
          <div className="space-y-4 sm:space-y-6">
            <EnhancedCryptoPortfolio />
          </div>
        </div>
      </div>
    </div>
  );
}
