import { useState } from 'react';

export default function FlashCard({ card, onClick, isCompleted }) {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleClick = () => {
    setShowAnswer(!showAnswer);
    onClick(); // Notify App to mark as completed
  };

  return (
    <div
      onClick={handleClick}
      className={`relative p-6 m-4 shadow-xl rounded-2xl text-center text-lg cursor-pointer min-h-[200px] flex items-center justify-center transition
      ${showAnswer ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100" : "bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"}
      `}
    >
      {/* Checkmark if completed */}
      {isCompleted && (
        <div className="absolute top-2 right-3 text-green-500 text-xl font-bold">
          ✓
        </div>
      )}

      <div>
        <p className="text-gray-500 text-sm">{card.topic}</p>
        <p className="font-bold mt-2">
          {showAnswer ? card.answer : card.question}
        </p>
        <p className="text-xs mt-1">
          {showAnswer ? "(Tap to hide)" : "(Tap to show answer)"}
        </p>
      </div>
    </div>
  );
}
