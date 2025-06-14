import React, { useState, useEffect } from "react";

const TestComponent: React.FC = () => {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("TestComponent mounted successfully");
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          React Test Component
        </h1>
        <p className="text-xl text-gray-600 mb-4">React hooks are working!</p>
        <div className="mb-4">
          <p className="text-lg">Count: {count}</p>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Increment
          </button>
        </div>
        <a
          href="/feed"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Go to Feed (Direct Link)
        </a>
      </div>
    </div>
  );
};

export default TestComponent;
