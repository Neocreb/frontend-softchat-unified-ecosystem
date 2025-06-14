import React from "react";

// Simple test component to verify React context is working
const ReactContextTest: React.FC = () => {
  console.log("ReactContextTest: Attempting to use React hooks");

  try {
    const [test, setTest] = React.useState("React Context Working");

    React.useEffect(() => {
      console.log("ReactContextTest: useEffect working");
      setTest("React Hooks Working!");
    }, []);

    return (
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          padding: "10px",
          background: "green",
          color: "white",
          borderRadius: "4px",
          fontSize: "12px",
          zIndex: 9999,
        }}
      >
        {test}
      </div>
    );
  } catch (error) {
    console.error("ReactContextTest Error:", error);
    return (
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          padding: "10px",
          background: "red",
          color: "white",
          borderRadius: "4px",
          fontSize: "12px",
          zIndex: 9999,
        }}
      >
        React Context Error:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
};

export default ReactContextTest;
