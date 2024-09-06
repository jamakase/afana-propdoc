"use client";
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
<<<<<<< HEAD:frontend/src/app/main/page.tsx
import Link from 'next/link';

// import { api } from './api';
=======
import Header from './_components/Header';
import { api } from '@/domain/api';
>>>>>>> main:frontend/src/app/page.tsx

type Chat = {
  id: number;
  name: string;
  messages: Array<{ id: number; text: string; sender: string }>;
  conversationId: number;
};

export default function Home() {
  const menuRef = useRef(null);

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState(0);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: string }>>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      if (chats.length === 0) {
        const newChatId = await handleAddChat();
        if (!newChatId) return;
      }

      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'user'
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: [...chat.messages, newMessage] } 
            : chat
        )
      );

      // Закомментировали вызов API
      // const response = await api.sendMessage(currentConversationId!, message);
      // if (!response.task_id) {
      //   throw new Error('Ошибка при отправке сообщения');
      // }

      console.log('Сообщение успешно отправлено');

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
    const selectedChat = chats.find(chat => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      setCurrentConversationId(selectedChat.conversationId);
    }
  };

  const createNewConversation = async () => {
    // Заменили вызов API на локальную генерацию ID
    return Math.floor(Math.random() * 1000000);
  };

  const handleAddChat = async () => {
    const newConversationId = await createNewConversation();
    if (!newConversationId) return null;

    const maxId = Math.max(...chats.map(chat => chat.id), 0);
    const newChatId = maxId + 1;
    const newChat = {
      id: newChatId,
      name: `Чат ${newChatId}`,
      messages: [],
      conversationId: newConversationId
    };
    setChats(prevChats => [...prevChats, newChat]);
    setCurrentChatId(newChatId);
    setCurrentConversationId(newConversationId);
    setMessages([]);
    return newChatId;
  };

  const handleDeleteChat = (chatId: number) => {
    setChats(prevChats => {
      const updatedChats = prevChats.filter(chat => chat.id !== chatId);
      if (updatedChats.length === 0) {
        setCurrentChatId(0);
        setCurrentConversationId(null);
        setMessages([]);
      } else if (currentChatId === chatId) {
        const newCurrentChat = updatedChats[0];
        setCurrentChatId(newCurrentChat.id);
        setCurrentConversationId(newCurrentChat.conversationId);
        setMessages(newCurrentChat.messages);
      }
      return updatedChats;
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden hide-scrollbar">
      <main className="flex h-screen">
        <aside
          ref={menuRef}
          className="w-64 h-screen bg-black flex flex-col overflow-hidden"
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-white">История чатов</h2>
            <Link href="/search" className="w-full p-2 mb-4 bg-green-500 rounded-2xl text-white rounded hover:bg-green-600 inline-block text-center">
              Перейти к поиску
            </Link>
            
            <button
              onClick={handleAddChat}
              className="w-full p-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600"
            >
              Новый чат
            </button>
            
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <ul>
              {chats.map((chat) => (
                <li key={chat.id} className="mb-2 flex justify-between items-center">
                  <button
                    className={`flex-grow text-left p-2 hover:bg-gray-700 rounded text-white ${currentChatId === chat.id ? 'bg-gray-700' : ''}`}
                    onClick={() => handleChatChange(chat.id)}
                  >
                    {chat.name}
                  </button>
                  <button
                    onClick={() => handleDeleteChat(chat.id)}
                    className="ml-2 p-1 text-red-500 hover:text-red-700"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
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