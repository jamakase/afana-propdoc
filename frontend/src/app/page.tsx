"use client";

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: string }>>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const response = await api.get_messages__user_id_();
        console.log('API response:', response);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const formattedConversations = response.data.map((id: number) => ({
            id: id,
            name: `Чат ${response.data.indexOf(id) + 1}`,
            messages: [] // Здесь нужно будет загрузить сообщения отдельным запросом
          }));
          
          setConversations(formattedConversations);
          setCurrentConversationId(formattedConversations[0].id);
          
          // Здесь нужно загрузить сообщения для первой беседы
          // и установить их с помощью setMessages
          // Например: const messages = await api.getMessagesForConversation(formattedConversations[0].id);
          // setMessages(messages);
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

      // Опционально: показать уведомление об успешном удалении
      console.log('Чат успешно удален');
    } catch (error) {
      // Обработка ошибок
      console.error('Ошибка при удалении чата:', error);
      // Опционально: показать уведомление об ошибке пользователю
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden hide-scrollbar">
      <main className="flex h-screen">
        <Sidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onConversationChange={handleChatChange}
          onAddConversation={handleAddConversation}
          onDeleteConversation={(id) => handleDeleteConversation(id)}
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col h-screen">
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
                 bg-[#2E236C] p-[2px]focus:outline-none cursor-pointer select-none"
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