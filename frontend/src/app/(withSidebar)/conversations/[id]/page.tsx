"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/domain/api/api";
import { useConfig } from "@/domain/config/ConfigProvider";
import { useRouter } from "next/navigation";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const config = useConfig();
  const router = useRouter();
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
        <div
          className={`fixed left-0 top-0 h-full md:relative z-50 ${
            isSidebarOpen ? "z-50" : "z-10"
          }`}
        ></div>

        <div className="flex-1 flex flex-col h-screen ml-[0px] md:ml-0 overflow-y-auto">
          <MessageList messages={currentConversation || []} />

          <div className="p-4 bg-white fixed bottom-0 w-full md:relative">
            <div className="flex items-stretch">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введите ваш вопрос"
                className="flex-grow p-2 bg-[#EFF0F3] border border-gray-300 rounded-l-2xl focus:outline-none h-full"
                style={{ color: "black" }}
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
