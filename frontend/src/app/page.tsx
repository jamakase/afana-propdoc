"use client";

import { useState, useEffect } from 'react';
import { api } from './api';
import Sidebar from './components/Sidebar';
import MessageList from './components/MessageList';

// Тип для хранения информации о чате
type Conversation = {
  id: number;
  name: string;
  messages: Array<{ id: number; text: string; sender: string }>;
};

// Основная функция компонента
export default function Home() {
  // Состояния для хранения списка чатов, текущего чата и сообщений
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: string }>>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const response = await api.get_messages__user_id_();
        console.log('API response:', response);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const formattedConversations = response.data.map((id: number) => ({
            id: id,
            name: `Чат ${response.data.indexOf(id) + 1}`,
            messages: []
          }));
          
          setConversations(formattedConversations);
          setCurrentConversationId(formattedConversations[0].id);
          
          await loadMessagesForConversation(formattedConversations[0].id);
        } else {
          const newConversation = await handleAddConversation();
          setConversations([newConversation]);
          setCurrentConversationId(newConversation.id);
        }
      } catch (error) {
        console.error('Ошибка при инициализации пользователя:', error);
      }
    };

    initializeUser();
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      if (currentConversationId === null) {
        const newConversation = await handleAddConversation();
        if (!newConversation) {
          throw new Error('Не удалось создать новый чат');
        }
      }
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'user'
      };

      const conversationIdAtSend = currentConversationId;

      setMessages(prevMessages => [...prevMessages, newMessage]);
      setConversations(prevConversations =>
        prevConversations.map(conversation =>
          conversation.id === conversationIdAtSend
            ? { ...conversation, messages: [...conversation.messages, newMessage] }
            : conversation
        )
      );

      const response = await api.sendMessage(conversationIdAtSend!, message);

      if (!response.task_id) {
        throw new Error('Ошибка при отправке сообщения');
      }

      console.log('Сообщение успешно отправлено, task_id:', response.task_id);
      setMessage('');

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

  const handleChatChange = async (id: number) => {
    const selectedConversation = conversations.find(conversation => conversation.id === id);
    if (selectedConversation) {
      setCurrentConversationId(selectedConversation.id);
      if (selectedConversation.messages.length === 0) {
        await loadMessagesForConversation(selectedConversation.id);
      } else {
        setMessages(selectedConversation.messages);
      }
    }
  };

  const handleAddConversation = async () => {
    try {
      const response = await api.createConversation();
      if (response.conversation_id) {
        const newConversation = {
          id: response.conversation_id,
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

  const handleDeleteConversation = async (conversationId: number) => {
    try {
      await api.deleteConversation(conversationId);

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
      console.log('Чат успешно удален');
    } catch (error) {
      console.error('Ошибка при удалении чата:', error);
    }
  };

  const loadMessagesForConversation = async (conversationId: number) => {
    try {
      const response = await api.getMessages(conversationId);
      if (response && response.length > 0 && response[0].messages && response[0].messages.length > 0) {
        const conversationMessages = response[0].messages[0][conversationId];
        if (conversationMessages && Array.isArray(conversationMessages)) {
          const formattedMessages = conversationMessages.map((msg: any) => ({
            id: msg.id,
            text: msg.text,
            sender: msg.role === 1 ? 'bot' : 'user'
          }));
          setMessages(formattedMessages);
          setConversations(prevConversations =>
            prevConversations.map(conv =>
              conv.id === conversationId ? { ...conv, messages: formattedMessages } : conv
            )
          );
        } else {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке сообщений:', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden hide-scrollbar">
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#17153B] p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">AFANA</h1>
        {isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
      </header>
      <main className="flex h-screen pt-16 md:pt-0">
        <div className="fixed left-0 top-0 h-full md:relative">
          <Sidebar
            conversations={conversations}
            currentConversationId={currentConversationId}
            onConversationChange={handleChatChange}
            onAddConversation={handleAddConversation}
            onDeleteConversation={(id) => handleDeleteConversation(id)}
            isSidebarOpen={isSidebarOpen}
            onCloseSidebar={() => setIsSidebarOpen(false)}
          />
        </div>

        <div className="flex-1 flex flex-col h-screen ml-[300px] md:ml-0">
          <MessageList messages={messages} />

          <div className="p-4 bg-white">
            <div className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введите ваш вопрос"
                className="flex-grow p-2 bg-gray-300 border border-gray-300 rounded-l-2xl focus:outline-none"
                style={{ color: 'black' }}
              />
              <button
                onClick={handleSendMessage}
                className="group w-auto inline-block text-center rounded-r-2xl
                 bg-[#2E236C] p-[2px] focus:outline-none cursor-pointer select-none"
              >
                <span className="block rounded-r-2xl bg-[#17153B] px-6 py-3 text-sm font-medium group-hover:bg-transparent">
                  <h2 className="text-sm text-white">
                    Отправить
                  </h2>
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}