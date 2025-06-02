import { useState } from 'react';
import cards from './data/cards';
import FlashCard from './components/FlashCard';
import ProgressBar from './components/ProgressBar';
import { useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

// Helper to extract all topics from card data
const allTopics = [...new Set(cards.map(card => card.topic))];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedTopic]);

  const handleCardClick = (id) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
  };

  const filteredCards = selectedTopic
  ? cards.filter(c => c.topic === selectedTopic)
  : cards;

  const [animationDirection, setAnimationDirection] = useState(''); // '' | 'up' | 'down'

  const handlers = useSwipeable({
          onSwipedUp: () => {
            if (currentIndex < filteredCards.length - 1) {
              setAnimationDirection('up');
              setCurrentIndex((prev) => prev + 1);
            }
          },
          onSwipedDown: () => {
            if (currentIndex > 0) {
              setAnimationDirection('down');
              setCurrentIndex((prev) => prev - 1);
            }
          },
          preventScrollOnSwipe: true,
          trackTouch: true,
          trackMouse: true,
        });

  return (
  <div className={darkMode ? 'dark' : ''}>
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8 transition-colors">
      <ProgressBar total={cards.length} completed={completed.length} />

      {/* Top control buttons */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {/* Dark Mode Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-full font-semibold shadow-md transition ${
            darkMode
              ? 'bg-white text-gray-900 hover:bg-gray-100'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>

        {/* Reset Progress Button */}
        <button
          onClick={() => setCompleted([])}
          className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 transition"
        >
          Reset Progress
        </button>
      </div>


      {/* Topic filter buttons */}
      <div className="flex justify-center gap-2 flex-wrap mb-6">
        <button
          onClick={() => setSelectedTopic(null)}
          className={`px-3 py-1 rounded-full border ${
            selectedTopic === null
              ? 'bg-blue-500 text-white'
              : 'bg-white text-blue-500 dark:bg-gray-800 dark:text-blue-300'
          }`}
        >
          All
        </button>

        {allTopics.map(topic => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`px-3 py-1 rounded-full border ${
              selectedTopic === topic
                ? 'bg-blue-500 text-white'
                : 'bg-white text-blue-500 dark:bg-gray-800 dark:text-blue-300'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Flashcards */}
      <div
        {...handlers}
        key={filteredCards[currentIndex]?.id} // 🔑 IMPORTANT for transition
        className={`transition-all duration-300 ease-in-out ${
          animationDirection === 'up'
            ? 'animate-slide-up'
            : animationDirection === 'down'
            ? 'animate-slide-down'
            : ''
        }`}
        style={{ transform: `translateY(0)` }} // placeholder in case we animate later
      >
        <FlashCard
          card={filteredCards[currentIndex]}
          onClick={() => handleCardClick(filteredCards[currentIndex]?.id)}
          isCompleted={completed.includes(filteredCards[currentIndex]?.id)}
        />
      </div>

    {/* Navigation buttons */}
    {/* <div className="flex justify-center gap-4 mt-6">
      <button
        onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
        className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-black dark:text-white font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition"
      >
        ⬆️ Previous
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => Math.min(filteredCards.length - 1, prev + 1))}
        className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-black dark:text-white font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition"
      >
        ⬇️ Next
      </button>
    </div> */}
    </div>
  </div>
);

}

export default App;
