import { useState, useEffect } from 'react';
import cards from './data/cards';
import FlashCard from './components/FlashCard';
import ProgressBar from './components/ProgressBar';
import { useSwipeable } from 'react-swipeable';
import NotesView from './components/NotesView';

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
        {/* Menu Button */}
        <div className="fixed z-50 top-4 left-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            ☰ Menu
          </button>
        </div>

        {/* Sidebar + Backdrop */}
        <div
          className={`fixed inset-0 z-40 ${sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          {/* Dim Background */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 bg-black backdrop-blur-sm ${sidebarOpen ? 'opacity-40' : 'opacity-0'}`}
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar Panel */}
          <div
            className={`absolute top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 text-black dark:text-white shadow-xl p-6 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-6 mt-10">Study App</h2>
            <button onClick={() => { setActiveView("flashcards"); setSidebarOpen(false); }} className="block w-full text-left mb-4 hover:bg-blue-100 dark:hover:bg-blue-900 px-3 py-2 rounded">📇 Flashcards</button>
            <button onClick={() => { setActiveView("askAI"); setSidebarOpen(false); }} className="block w-full text-left mb-4 hover:bg-blue-100 dark:hover:bg-blue-900 px-3 py-2 rounded">🤖 Ask AI</button>
            <button onClick={() => { setActiveView("notes"); setSidebarOpen(false); }} className="block w-full text-left mb-4 hover:bg-blue-100 dark:hover:bg-blue-900 px-3 py-2 rounded">📝 Chat notes</button>
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
            <NotesView />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
