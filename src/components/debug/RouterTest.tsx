import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RouterTest = () => {
  try {
    const location = useLocation();
    const navigate = useNavigate();

    return (
      <div className="p-4 bg-green-100 border border-green-400 rounded">
        <h3 className="text-green-800 font-bold">Router Context Test</h3>
        <p className="text-green-700">✅ Router context is working!</p>
        <p className="text-sm text-green-600">
          Current path: {location.pathname}
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          Test navigate
        </button>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded">
        <h3 className="text-red-800 font-bold">Router Context Error</h3>
        <p className="text-red-700">❌ Router context is not available!</p>
        <p className="text-sm text-red-600">
          Error: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }
};

export default RouterTest;
