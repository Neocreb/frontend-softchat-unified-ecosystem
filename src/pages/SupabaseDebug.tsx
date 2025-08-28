import React from "react";
import SupabaseConnectionTest from "@/components/debug/SupabaseConnectionTest";

const SupabaseDebug: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Supabase Debug</h1>
        <p className="text-muted-foreground">
          Diagnose and test Supabase authentication issues
        </p>
      </div>
      
      <SupabaseConnectionTest />
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Access this page at: <code className="bg-gray-100 px-2 py-1 rounded">/supabase-debug</code>
        </p>
      </div>
    </div>
  );
};

export default SupabaseDebug;
