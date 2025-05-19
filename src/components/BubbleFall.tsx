import { useEffect, useState } from "react";

const shapes = [
  { char: "💎", type: "crypto" },
  { char: "₿", type: "crypto" },
  { char: "🎁", type: "rewards" },
  { char: "🏆", type: "rewards" },
  { char: "🛒", type: "marketplace" },
  { char: "🏷️", type: "marketplace" },
  { char: "💬", type: "chat" },
  { char: "🧠", type: "softchat" },
  { char: "💵", type: "softchat" },
];

const getRandom = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const BubbleFall = () => {
  const [bubbles, setBubbles] = useState<
    { id: number; shape: string }[]
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      const shapeObj = shapes[Math.floor(Math.random() * shapes.length)];
      const shape = shapeObj.char;

      setBubbles((prev) => [...prev, { id, shape }]);

      if (bubbles.length > 25) {
        setBubbles((prev) => prev.slice(5));
      }
    }, 400);

    return () => clearInterval(interval);
  }, [bubbles]);

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {bubbles.map(({ id, shape }) => {
        const left = getRandom(0, 95);
        const size = getRandom(20, 40);
        const delay = getRandom(0, 3);
        const duration = getRandom(8, 14);

        return (
          <span
            key={id}
            className="absolute animate-fall select-none"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              fontSize: `${size}px`,
            }}
          >
            {shape}
          </span>
        );
      })}
    </div>
  );
};

export default BubbleFall;
