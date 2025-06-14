// Minimal test component to isolate React issues
import { useState } from "react";

export function MinimalTest() {
  const [count, setCount] = useState(0);

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        background: "white",
        padding: "10px",
        border: "1px solid #ccc",
        zIndex: 9999,
      }}
    >
      <h3>React Test</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}

export default MinimalTest;
