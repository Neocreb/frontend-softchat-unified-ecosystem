import React, { useState, useEffect } from "react";

const ReactDiagnostic: React.FC = () => {
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Test basic React functionality
      setIsWorking(true);
      console.log("React hooks are working correctly");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("React hooks error:", err);
    }
  }, []);

  if (error) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
        <strong>React Error:</strong> {error}
      </div>
    );
  }

  if (!isWorking) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded z-50">
        <strong>React Status:</strong> Loading...
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
      <strong>React Status:</strong> ✅ Working
    </div>
  );
};

export default ReactDiagnostic;
