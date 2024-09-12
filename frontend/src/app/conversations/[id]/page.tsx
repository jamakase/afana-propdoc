"use client";

import { useState, useEffect } from 'react';
import { api } from '@/domain/api/api';
import Sidebar from '../../components/Sidebar';
import MessageList from '../../components/MessageList';
import { useConfig } from '@/domain/config/ConfigProvider';
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';

// Тип для хранения информации о чате
type Conversation = {
  id: number;
  name: string;
  messages: Array<{ id: number; text: string; sender: string }>;
};

// Основная функция компонента
export default function ConversationPage({ params }: { params: { id: string } }) {
  // Состояния для хранения списка чатов, текущего чата и сообщений
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: string }>>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const config = useConfig();
  const router = useRouter();

  // Инициализация пользователя
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const response = await api.get_messages__user_id_(config.ENDPOINT);
        console.log('API response:', response);

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const formattedConversations = response.data.map((id: number, index: number) => ({
            id: id,
            name: `Чат ${index + 1}`,
            messages: []
          }));

          setConversations(formattedConversations);

          const initialConversationId = parseInt(params.id);
          setCurrentConversationId(initialConversationId);

          await loadMessagesForConversation(initialConversationId);
        } else {
          const newConversation = await handleAddConversation();
          setConversations([newConversation]);
          setCurrentConversationId(newConversation.id);
          router.push(`/conversations/${newConversation.id}`);
        }
      } catch (error) {
        console.error('Ошибка при инициализации пользователя:', error);
      }
    };

    initializeUser();
  }, [params.id, config.ENDPOINT, router]);

  useEffect(() => {
    const loadData = async () => {
      if (currentConversationId) {
        await loadMessagesForConversation(currentConversationId);
      }
    };

    loadData();
  }, [currentConversationId, config.ENDPOINT]);

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

      const response = await api.sendMessage(config.ENDPOINT, conversationIdAtSend!, message);

      if (!response.task_id) {
        throw new Error('Ошибка при отправке сообщения');
      }

      console.log('Сообщение успешно отправлено, task_id:', response.task_id);
      setMessage('');

      let botResponse;
      do {
        await new Promise(resolve => setTimeout(resolve, 1000));
        botResponse = await api.checkTaskResult(config.ENDPOINT, response.task_id);
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
    setCurrentConversationId(id);
    await loadMessagesForConversation(id);
    router.push(`/conversations/${id}`);
  };

  const handleAddConversation = async () => {
    try {
      const response = await api.createConversation(config.ENDPOINT);
      if (response.conversation_id) {
        const maxChatNumber = Math.max(...conversations.map(conv => {
          const match = conv.name.match(/Чат (\d+)/);
          return match ? parseInt(match[1]) : 0;
        }), 0);

        const newChatNumber = maxChatNumber + 1;

        const newConversation = {
          id: response.conversation_id,
          name: `Чат ${newChatNumber}`,
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
      await api.deleteConversation(config.ENDPOINT, conversationId);

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
      const response = await api.getMessages(config.ENDPOINT, conversationId);
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
      {!isSidebarOpen && (   
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      )}

      <main className="flex h-screen">
        <div className={`fixed left-0 top-0 h-full md:relative z-50 ${isSidebarOpen ? 'z-50' : 'z-10'}`}>
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

        <div className="flex-1 flex flex-col h-screen ml-[0px] md:ml-0 overflow-y-auto">
          <MessageList messages={messages} />

          <div className="p-4 bg-white fixed bottom-0 w-full md:relative">
            <div className="flex items-stretch">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введите ваш вопрос"
                className="flex-grow p-2 bg-[#EFF0F3] border border-gray-300 rounded-l-2xl focus:outline-none h-full"
                style={{ color: 'black' }}
              />
              <Button
                onClick={handleSendMessage}
                className="rounded-r-2xl rounded-l-none bg-[#1D1F27] focus:outline-none cursor-pointer hover:bg-[#606371] border-l-0 h-full"
              >
                Отправить
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
