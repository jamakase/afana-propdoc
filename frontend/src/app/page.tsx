"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { api } from './api';
import Sidebar from './components/Sidebar';
import MessageList from './components/MessageList';


type Conversation = {
  id: number;
  name: string;
  messages: Array<{ id: number; text: string; sender: string }>;
};

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: string }>>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);

  useEffect(() => {
    const createInitialChat = async () => {
      if (conversations.length === 0) {
        try {
          const newConversation = await handleAddConversation();
          setConversations([newConversation]);
          setCurrentConversationId(newConversation.id);
        } catch (error) {
          console.error('Ошибка при создании начального чата:', error);
        }
      }
    };

    createInitialChat();
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      if (currentConversationId === null) {
        await handleAddConversation();
      }

      if (currentConversationId === null) {
        throw new Error('Не удалось создать или выбрать чат');
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

      console.log('Сообщение успешно отправлено, task_id:', response.task_id);

      let botResponse;
      do {
        await new Promise(resolve => setTimeout(resolve, 1000));
        botResponse = await api.checkTaskResult(response.task_id);
      } while (!botResponse.ready);

      if (botResponse.successful && botResponse.value) {
        const botMessage = {
          id: messages.length + 2,
          text: botResponse.value.answer,
          sender: 'bot'
        };

        setMessages(prevMessages => [...prevMessages, botMessage]);
        setConversations(prevConversations =>
          prevConversations.map(conversation =>
            conversation.id === currentConversationId
              ? { ...conversation, messages: [...conversation.messages, botMessage] }
              : conversation
          )
        );
      }

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

  const handleChatChange = (id: number) => {
    const selectedConversation = conversations.find(conversation => conversation.id === id);
    if (selectedConversation) {
      setMessages(selectedConversation.messages);
      setCurrentConversationId(selectedConversation.id);
    }
  };

  const handleAddConversation = async () => {
    try {
      const response = await api.createConversation();
      if (response.conversation_id) {
        const newConversation = {
          id: conversations.length + 1,
          name: `Чат ${conversations.length + 1}`,
          messages: []
        };
        setConversations(prevConversations => [...prevConversations, newConversation]);
        setCurrentConversationId(newConversation.id);
        setMessages([]);
        return newConversation;
      } else {
        throw new Error('Не удалось создать новый чат');
      }
    } catch (error) {
      console.error('Ошибка при создании чата:', error);
      throw error;
    }
  };

  const handleDeleteConversation = (conversationId: number) => {
    setConversations(prevConversations => {
      const updatedConversations = prevConversations.filter(conversation => conversation.id !== conversationId);
      if (updatedConversations.length === 0) {
        setCurrentConversationId(null);
        setMessages([]);
      } else if (currentConversationId === conversationId) {
        const newCurrentConversation = updatedConversations[0];
        setCurrentConversationId(newCurrentConversation.id);
        setMessages(newCurrentConversation.messages);
      }
      return updatedConversations;
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden hide-scrollbar">
      <main className="flex h-screen">
        <Sidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onConversationChange={handleChatChange}
          onAddConversation={handleAddConversation}
          onDeleteConversation={handleDeleteConversation}
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