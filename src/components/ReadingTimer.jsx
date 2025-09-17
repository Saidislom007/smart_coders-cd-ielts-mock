import { useState, useEffect } from "react";

const ReadingTimer = ({ onTimeUp, isRunning }) => {
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      style={{
        background: "#fff",
        padding: "8px 12px",
        borderRadius: "6px",
        boxShadow: "0 0 6px rgba(0,0,0,0.15)",
        fontWeight: "bold",
      }}
    >
      {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
};

export default ReadingTimer;
