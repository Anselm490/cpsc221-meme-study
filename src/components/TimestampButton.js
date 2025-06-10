// TimestampButton.js
import React from "react";

const TimestampButton = ({ onSend }) => {
  const handleClick = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timestamp = `${hours}:${minutes}`;
    onSend(timestamp);
  };

  return (
    <button onClick={handleClick} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
      ⏱️ Timestamp
    </button>
  );
};

export default TimestampButton;

// Usage in Chat component (example)
// <TimestampButton onSend={handleSendMessage} />
