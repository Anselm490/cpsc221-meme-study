import { useState, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { marked } from 'marked';
import TimestampButton from './TimestampButton';

function NotesView() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('notesMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [sender, setSender] = useState('me');
  const [replyTo, setReplyTo] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showPickerId, setShowPickerId] = useState(null);

  useEffect(() => {
    localStorage.setItem('notesMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = (msg) => {
    const content = typeof msg === 'string' ? msg : input;
    if (!content.trim()) return;
    if (editId !== null) {
      setMessages(messages.map(msg => {
        if (msg.id !== editId) return msg;
        if (msg.text === content) return msg;
        return { ...msg, text: content, editCount: (msg.editCount || 0) + 1 };
      }));
      setEditId(null);
    } else {
      const newMessage = {
        id: Date.now(),
        text: content,
        sender,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        replyTo,
        editCount: 0,
        reactions: {}
      };
      setMessages([...messages, newMessage]);
      setReplyTo(null);
    }
    setInput('');
  };

  const toggleReaction = (id, emoji) => {
    setMessages(messages.map(msg => {
      if (msg.id !== id) return msg;
      const updated = { ...msg.reactions };
      if (!updated[emoji]) updated[emoji] = [];
      if (updated[emoji].includes(sender)) {
        updated[emoji] = updated[emoji].filter(s => s !== sender);
      } else {
        updated[emoji].push(sender);
      }
      return { ...msg, reactions: updated };
    }));
  };

  const getMessageById = (id) => messages.find((m) => m.id === id);

  const renderThread = (msg, level = 0) => {
    const replies = messages.filter((m) => m.replyTo === msg.id);
    return (
      <div key={msg.id} className={`ml-${level * 4} space-y-2`}>
        <div className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
          <div className={`rounded-lg px-4 py-2 max-w-[70%] shadow relative space-y-1 ${
            msg.sender === 'me'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
          }`}>
            {msg.replyTo && (
              <div className="text-xs italic opacity-70 border-l-2 pl-2 border-gray-400">
                Replying to: {getMessageById(msg.replyTo)?.text || 'unknown'}
              </div>
            )}
            <div
              className="text-sm whitespace-pre-wrap prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }}
            ></div>
            <div className="flex items-center justify-between text-xs opacity-70">
              <span>{msg.timestamp}</span>
              {msg.editCount > 0 && <span>(edited x{msg.editCount})</span>}
            </div>
            <div className="flex items-center flex-wrap gap-2">
              <div className="flex gap-1">
                {msg.reactions && Object.entries(msg.reactions || {}).map(([emoji, users]) => (
                  typeof emoji === 'string' && Array.isArray(users) && emoji.length > 0 &&
                  <button
                    key={emoji}
                    onClick={() => toggleReaction(msg.id, emoji)}
                    className={`text-sm transform transition duration-150 ease-in-out hover:scale-125 ${users.includes(sender) ? 'opacity-100' : 'opacity-40'}`}
                  >
                    {emoji} {users.length}
                  </button>
                ))}
                <button
                  onClick={() => setShowPickerId(showPickerId === msg.id ? null : msg.id)}
                  className="text-gray-500 hover:text-gray-700"
                >➕</button>
              </div>
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => setReplyTo(msg.id)}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
                  title="Reply"
                >⤶</button>
                <button
                  onClick={() => {
                    setEditId(msg.id);
                    setInput(msg.text);
                  }}
                  className="text-gray-700 dark:text-gray-300 hover:text-yellow-500"
                  title="Edit"
                >✏️</button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this message?')) {
                      setMessages(messages.filter(m => m.id !== msg.id));
                    }
                  }}
                  className="text-gray-700 dark:text-gray-300 hover:text-red-500"
                  title="Delete"
                >🗑️</button>
              </div>
            </div>
            {showPickerId === msg.id && (
              <div className="absolute z-50 mt-2">
                <EmojiPicker
                  onEmojiClick={(e, emojiObject) => {
                    toggleReaction(msg.id, emojiObject.emoji);
                    setShowPickerId(null);
                  }}
                />
              </div>
            )}
          </div>
        </div>
        {replies.map((reply) => renderThread(reply, level + 1))}
      </div>
    );
  };

  const topLevelMessages = messages.filter((m) => !m.replyTo);

  // Ensure reactions are initialized as arrays
  messages.forEach(msg => {
    if (msg.reactions) {
      Object.keys(msg.reactions).forEach(emoji => {
        if (typeof msg.reactions[emoji] === 'number') {
          msg.reactions[emoji] = msg.reactions[emoji] ? [sender] : [];
        }
      });
    }
  });

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
        {topLevelMessages.map((msg) => renderThread(msg))}
      </div>

      {(replyTo || editId !== null) && (
        <div className="text-sm text-gray-500 mb-2">
          {replyTo && <div>Replying to: <span className="italic">{getMessageById(replyTo)?.text}</span></div>}
          {editId !== null && <div>Editing: <span className="italic">{getMessageById(editId)?.text}</span></div>}
          <button
            onClick={() => { setReplyTo(null); setEditId(null); setInput(''); }}
            className="mt-1 text-red-500 hover:underline text-xs"
          >Cancel</button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <TimestampButton onSend={handleSend} />
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a note and hit Enter..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none"
          rows={2}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
        >
          {editId !== null ? 'Update' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default NotesView;