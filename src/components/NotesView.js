import { useState } from 'react';

function NotesView() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sender, setSender] = useState('me'); // 'me' or 'other'

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now(),
      text: input,
      sender,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[90vh] max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Notes</h2>
        <button
          onClick={() => setSender(sender === 'me' ? 'other' : 'me')}
          className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Send as: {sender === 'me' ? 'Me →' : '← Other'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`rounded-lg px-4 py-2 max-w-[70%] shadow ${
              msg.sender === 'me'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
            }`}>
              <div className="text-sm whitespace-pre-wrap">{msg.text}</div>
              <div className="text-xs text-right opacity-70 mt-1">{msg.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a note and hit Enter..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default NotesView;
