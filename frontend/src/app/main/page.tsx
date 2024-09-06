"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { api } from '../api';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';

type Conversation = {
  id: number;
  name: string;
  messages: Array<{ id: number; text: string; sender: string }>;
  conversationId: number;
};

export default function Home() {
  const menuRef = useRef(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: string }>>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);

  useEffect(() => {
    const createInitialChat = async () => {
      try {
        const response = await api.createConversation();
        if (response.conversation_id) {
          const newChatId = await handleAddConversation(response.conversation_id);
          if (newChatId) {
            setCurrentConversationId(response.conversation_id);
          }
        } else {
          throw new Error('Не удалось создать новый чат');
        }
      } catch (error) {
        console.error('Ошибка при создании начального чата:', error);
      }
    };

    if (conversations.length === 0) {
      createInitialChat();
    }
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      if (conversations.length === 0) {
        const newChatId = await handleAddConversation();
        if (!newChatId) return;
      }

      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'user'
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setConversations(prevConversations => 
        prevConversations.map(conversation => 
          conversation.id === currentConversationId 
            ? { ...conversation, messages: [...conversation.messages, newMessage] } 
            : conversation
        )
      );

      
      const response = await api.sendMessage(currentConversationId!, message);
      if (!response.task_id) {
        throw new Error('Ошибка при отправке сообщения');
      }

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

  const handleChatChange = (conversationId: number) => {
    setCurrentConversationId(conversationId);
    const selectedChat = conversations.find(conversation => conversation.id === conversationId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      setCurrentConversationId(selectedChat.conversationId);
    }
  };

  const handleAddConversation = async (conversationId?: number) => {
    const newId = conversationId || await createNewConversation();
    if (!newId) return null;

    const maxId = Math.max(...conversations.map(conversation => conversation.id), 0);
    const newConversationId = maxId + 1;

    const newConversation = {
      id: newConversationId,
      name: `Чат ${newConversationId}`,
      messages: [],
      conversationId: newId
    };
    setConversations(prevConversations => [...prevConversations, newConversation]);
    setCurrentConversationId(newId);
    setMessages([]);
    return newId;
  };

  const createNewConversation = async () => {
    try {
      const response = await api.createConversation();
      return response.conversation_id;
    } catch (error) {
      console.error('Ошибка при создании нового разговора:', error);
      return null;
    }
  };

  const handleDeleteChat = (chatId: number) => {
    setConversations(prevConversations => {
      const updatedChats = prevConversations.filter(chat => chat.id !== chatId);
      if (updatedChats.length === 0) {
        setCurrentConversationId(0);
        setCurrentConversationId(null);
        setMessages([]);
      } else if (currentConversationId === chatId) {
        const newCurrentConversation = updatedChats[0];
        setCurrentConversationId(newCurrentConversation.conversationId);
        setMessages(newCurrentConversation.messages);
      }
      return updatedChats;
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden hide-scrollbar">
      <main className="flex h-screen">
        <Sidebar
          chats={conversations}
          currentChatId={currentConversationId}
          onChatChange={handleChatChange}
          onAddConversation={() => handleAddConversation()}
          onDeleteChat={handleDeleteChat}
        />

        <div className="flex-1 flex flex-col h-screen">
          <MessageList messages={messages} />

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