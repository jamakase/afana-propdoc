"use client"; 
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [chats] = useState([
    { id: 1, name: 'Чат 1', messages: [
      { id: 1, text: 'Привет! Это чат 1. Чем могу помочь?', sender: 'bot' },
      { id: 2, text: 'Штош, начнем...', sender: 'user' },
    ]}
  ]);

  const [currentChatId, setCurrentChatId] = useState(1);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(chats[0].messages);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'user'
      };
      setMessages([...messages, newMessage]);
      console.log('Отправка сообщения:', message);
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          conversation_id: currentChatId, 
          message: message 
        }),
      });

      if (!response.ok) {
        throw new Error('Error has occured!');
      }

      console.log('Сообщение успешно отправлено на бэкенд');
      
      setMessage('');
    } catch (error) {
      console.error('Error has occured!', error);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleChatChange = (chatId: number) => {
    setCurrentChatId(chatId);
    setMessages(chats.find(chat => chat.id === chatId)?.messages || []);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (event.clientX <= 10) {
        setIsMenuOpen(true);
      } else if (event.clientX > 256 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen relative overflow-hidden hide-scrollbar">
      <Header />

      <main className="flex h-screen">
        <aside
          ref={menuRef}
          className={`${isMenuOpen ? 'w-64' : 'w-0 -ml-64'} absolute h-screen bg-black p-4 transition-all duration-300 overflow-hidden`}
          onMouseLeave={() => setIsMenuOpen(false)}
        >
          <h2 className="text-xl font-bold mb-4 text-white">История</h2>
          <ul>
            {chats.map((chat) => (
              <li key={chat.id} className="mb-2">
                <button 
                  className={`w-full text-left p-2 hover:bg-gray-700 rounded text-white ${currentChatId === chat.id ? 'bg-gray-700' : ''}`}
                  onClick={() => handleChatChange(chat.id)}
                >
                  {chat.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 flex flex-col h-screen">
          <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введите ваш вопрос"
                className="flex-grow p-2 border border-gray-300 rounded-l-2xl focus:outline-none"
                style={{ color: 'black' }}
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-2xl hover:bg-blue-600 focus:outline-none"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}