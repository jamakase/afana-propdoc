"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/domain/api/api";
import { useConfig } from "@/domain/config/ConfigProvider";
import { Send } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import MessageList from "../../../_components/MessageList";

// Тип для хранения информации о чате
type Conversation = {
  id: number;
  name: string;
  messages: Array<{ id: number; text: string; sender: string }>;
};

// Основная функция компонента
export default function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const [message, setMessage] = useState("");
  const [initialMessages, setInitialMessages] = useState([
    {
      id: 0,
      text: "Привет! Я бот, который поможет вам работать со строительными нормативными документами.",
      sender: "bot",
    },
  ]);

  const config = useConfig();
  const queryClient = useQueryClient();

  const { data: currentConversation } = useQuery(
    ["conversation", params.id],
    () =>
      api.getMessages(config.ENDPOINT, parseInt(params.id)).then((response) => {
        if (
          response &&
          response.length > 0 &&
          response[0].messages &&
          response[0].messages.length > 0
        ) {
          const conversationMessages =
            response[0].messages[0][parseInt(params.id)];
          if (conversationMessages && Array.isArray(conversationMessages)) {
            return conversationMessages.map((msg: any) => ({
              id: msg.id,
              text: msg.text,
              sender: msg.role === 1 ? "bot" : "user",
            }));
          }
        }
        return [];
      }),
    { enabled: !!params.id }
  );

  const sendMessageMutation = useMutation(
    (newMessage: string) =>
      api.sendMessage(config.ENDPOINT, parseInt(params.id), newMessage),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["conversation", params.id]);
      },
    }
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
    setMessage("");
  };

  const sortedConversation = currentConversation?.sort((a, b) => a.id - b.id);

  const isPendingRequest = sortedConversation &&
    sortedConversation.length > 0 &&
    sortedConversation[sortedConversation.length - 1].sender === "user" &&
    sortedConversation[sortedConversation.length - 1].text !== null;

  return (
    <div className="min-h-full w-full relative overflow-hidden hide-scrollbar">
      {/* {!isSidebarOpen && (
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
      )} */}

      <main className="flex h-full">

        <div className="flex-1 flex flex-col h-full ml-[0px] md:ml-0 overflow-y-auto">
          <MessageList
            messages={[
              ...initialMessages,
              ...(currentConversation || []),
              ...(isPendingRequest
                ? [{ id: Date.now(), text: "Ответ вот-вот будет...", sender: "bot" }]
                : []),
            ].sort((a, b) => a.id - b.id)}
          />

          <div className="p-4 bg-white border-t border-gray-300 fixed bottom-0 w-full md:relative">
            <div className="flex items-stretch gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введите ваш вопрос"
                className="flex-grow p-2 focus:outline-none h-full"
                style={{ color: "black" }}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                className="rounded-full"
              >
                <Send className="w-5 h-5 text-white mt-px mr-px" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}