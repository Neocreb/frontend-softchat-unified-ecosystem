import React, { useState, useEffect } from "react";

const ReactTest: React.FC = () => {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("ReactTest component mounted successfully");
  }, []);

  const handleClick = () => {
    setCount((prev) => prev + 1);
    console.log("React state update working, count:", count + 1);
  };

  if (!mounted) {
    return <div>Loading React test...</div>;
  }

  return (
    <div className="p-4 border border-green-500 bg-green-50 rounded-lg">
      <h3 className="text-lg font-bold text-green-800 mb-2">
        ✅ React Test Component
      </h3>
      <p className="text-green-700 mb-2">React hooks are working properly!</p>
      <p className="text-sm text-green-600 mb-2">Click count: {count}</p>
      <button
        onClick={handleClick}
        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Test useState
      </button>
    </div>
  );
};

export default ReactTest;
