import { useState, useEffect } from 'react';
import cards from './data/cards';
import FlashCard from './components/FlashCard';
import ProgressBar from './components/ProgressBar';
import { useSwipeable } from 'react-swipeable';

const allTopics = [...new Set(cards.map(card => card.topic))];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('');
  const [activeView, setActiveView] = useState('flashcards');

  const filteredCards = selectedTopic
    ? cards.filter(c => c.topic === selectedTopic)
    : cards;

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedTopic]);

  const handleCardClick = (id) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
  };

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
      <div className="relative bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors">

        {/* Toggle Sidebar Button (positioned safely below header) */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700"
          >
            ☰ Menu
          </button>
        </div>

        {/* Sidebar Backdrop + Animated Drawer */}
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 ${
            sidebarOpen ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>

          <div
            className={`absolute top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 text-black dark:text-white shadow-xl p-6 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-6">Study App</h2>
            <button onClick={() => { setActiveView("flashcards"); setSidebarOpen(false); }} className="block w-full text-left mb-4 hover:bg-blue-100 dark:hover:bg-blue-900 px-3 py-2 rounded">📇 Flashcards</button>
            <button onClick={() => { setActiveView("askAI"); setSidebarOpen(false); }} className="block w-full text-left mb-4 hover:bg-blue-100 dark:hover:bg-blue-900 px-3 py-2 rounded">🤖 Ask AI</button>
            <button onClick={() => { setActiveView("notes"); setSidebarOpen(false); }} className="block w-full text-left mb-4 hover:bg-blue-100 dark:hover:bg-blue-900 px-3 py-2 rounded">📝 Notes</button>
          </div>
        </div>

        <ProgressBar total={cards.length} completed={completed.length} />

        {/* Top control buttons */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap mt-20">
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
          <button
            onClick={() => setCompleted([])}
            className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 transition"
          >
            Reset Progress
          </button>
        </div>

        {/* Topic filter buttons */}
        {activeView === "flashcards" && (
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
        )}

        {/* Main Content View */}
        <div className="px-4">
          {activeView === "flashcards" && (
            <div
              {...handlers}
              key={filteredCards[currentIndex]?.id}
              className={`transition-all duration-300 ease-in-out ${
                animationDirection === 'up'
                  ? 'animate-slide-up'
                  : animationDirection === 'down'
                  ? 'animate-slide-down'
                  : ''
              }`}
              style={{ transform: `translateY(0)` }}
            >
              {filteredCards[currentIndex] && (
                <FlashCard
                  card={filteredCards[currentIndex]}
                  onClick={() => handleCardClick(filteredCards[currentIndex]?.id)}
                  isCompleted={completed.includes(filteredCards[currentIndex]?.id)}
                />
              )}
            </div>
          )}

          {activeView === "askAI" && (
            <div className="text-white">Ask AI feature coming soon...</div>
          )}

          {activeView === "notes" && (
            <div className="text-white">Notes feature coming soon...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
