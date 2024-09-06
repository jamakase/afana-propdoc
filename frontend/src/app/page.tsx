"use client"; 
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './_components/Header';
import { api } from '@/domain/api';

type Chat = {
  id: number;
  name: string;
  messages: Array<{ id: number; text: string; sender: string }>;
  conversationId: number;
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: string }>>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentConversationId) return;

    try {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'user'
      };
      setMessages([...messages, newMessage]);

      const response = await api.sendMessage(currentConversationId, message);

      if (!response.task_id) {
        throw new Error('Ошибка при отправке сообщения');
      }

      console.log('Сообщение успешно отправлено на бэкенд');
      
      setMessage('');
    } catch (error) {
      console.error('Произошла ошибка:', error);
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

  const createNewConversation = async () => {
    try {
      const response = await api.createConversation();
      return response.conversation_id;
    } catch (error) {
      console.error('Ошибка при создании новой беседы:', error);
      return null;
    }
  };

  const handleAddChat = async () => {
    const newConversationId = await createNewConversation();
    if (!newConversationId) return;

    const maxId = Math.max(...chats.map(chat => chat.id), 0);
    const newChatId = maxId + 1;
    const newChat = {
      id: newChatId,
      name: `Чат ${newChatId}`,
      messages: [],
      conversationId: newConversationId
    };
    setChats([...chats, newChat]);
    setCurrentChatId(newChatId);
    setCurrentConversationId(newConversationId);
    setMessages([]);
  };

  const handleDeleteChat = (chatId: number) => {
    if (chats.length <= 1) {
      // Если остался только один чат, не удаляем его
      return;
    }

    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    
    if (currentChatId === chatId) {
      const newCurrentChatId = updatedChats[0].id;
      setCurrentChatId(newCurrentChatId);
      setMessages(updatedChats[0].messages);
    }
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

  useEffect(() => {
    const initializeChat = async () => {
      if (chats.length === 0) {
        await handleAddChat();
      } else {
        setCurrentConversationId(chats[0].conversationId);
      }
    };

    initializeChat();
  }, []);

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
          <button 
            onClick={handleAddChat}
            className="w-full mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Новый чат
          </button>
          <ul>
            {chats.map((chat) => (
              <li key={chat.id} className="mb-2 flex justify-between items-center">
                <button 
                  className={`flex-grow text-left p-2 hover:bg-gray-700 rounded text-white ${currentChatId === chat.id ? 'bg-gray-700' : ''}`}
                  onClick={() => handleChatChange(chat.id)}
                >
                  {chat.name}
                </button>
                {chats.length > 1 && (
                  <button 
                    onClick={() => handleDeleteChat(chat.id)}
                    className="ml-2 p-1 text-red-500 hover:text-red-700"
                  >
                    X
                  </button>
                )}
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
