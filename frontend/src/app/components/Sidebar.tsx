import { useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type Conversation = {
  id: number;
  name: string;
  messages: Array<{ id: number; text: string; sender: string }>};

type SidebarProps = {
  conversations: Conversation[];
  currentConversationId: number | null;
  onConversationChange: (conversationId: number) => void;
  onAddConversation: () => void;
  onDeleteConversation: (conversationId: number) => void;
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
};

export default function Sidebar({ conversations, currentConversationId, onConversationChange, onAddConversation, onDeleteConversation, isSidebarOpen, onCloseSidebar }: SidebarProps) {
  const menuRef = useRef(null);

  return (
    <aside
      ref={menuRef}
      className={`fixed md:static inset-y-0 left-0 z-40 w-64 h-full bg-[#17153B] flex flex-col overflow-hidden transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <button
        className="md:hidden absolute top-2 right-4 text-white"
        onClick={onCloseSidebar}
      >
        ✕
      </button>
      <h1 className="text-4xl font-bold mb-4 bg-[#9400FF] text-center">AFANA</h1>

      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-white text-center">История чатов</h2>
        
        <a
          className="group w-full p-2 mb-4 inline-block text-center rounded-full bg-gradient-to-r from-[#27005D] via-[#9400FF] to-[#AED2FF] p-[2px] hover:text-white focus:outline-none active:text-opacity-75 transition-transform active:scale-95" // Добавлен эффект уменьшения при нажатии
          href="/search"
        >
          <span
            className="block rounded-full bg-black px-4 py-1 text-sm font-medium group-hover:bg-transparent"
          >
            <h2 className="text-sm text-white text-center">
              Перейти к поиску
            </h2>
          </span>
        </a>

        <button
          className="group w-full p-2 mb-4 inline-block text-center rounded-full bg-gradient-to-r from-[#070260] via-[#090979] to-[#00d4ff] p-[2px] hover:text-white focus:outline-none active:text-opacity-75 cursor-pointer select-none transition-transform active:scale-95" // Добавлен эффект уменьшения при нажатии
          onClick={onAddConversation}
        >
          <span
            className="block rounded-full bg-black px-4 py-1 text-sm font-medium group-hover:bg-transparent"
          >
            <h2 className="text-sm text-white text-center">
              Новый чат
            </h2>          
          </span>

        </button>        
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <fieldset className="space-y-4">
          <legend className="sr-only">Чаты</legend>
          <AnimatePresence mode="popLayout">
            {conversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  opacity: { duration: 0.2 },
                  layout: { duration: 0.4 },
                  scale: { duration: 0.2 }
                }}
              >
                <label
                  htmlFor={`chat-${conversation.id}`}
                  className={`flex text-base cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-700 p-4 text-sm font-medium shadow-sm hover:border-[#9400FF] ${
                    currentConversationId === conversation.id
                    ? 'bg-[#9400FF] text-black'
                      : 'bg-[#2E236C] text-white'
                  }`}
                >
                  <p className="text-white">{conversation.name}</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onDeleteConversation(conversation.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      height="24" 
                      viewBox="0 -960 960 960" 
                      width="24" 
                      fill="#00d4ff"
                      className="hover:fill-[#00ABCD]"
                    >
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                    </svg>
                  </button>
                  <input
                    type="radio"
                    name="ChatOption"
                    value={`chat-${conversation.id}`}
                    id={`chat-${conversation.id}`}
                    className="sr-only"
                    checked={currentConversationId === conversation.id}
                    onChange={() => onConversationChange(conversation.id)}
                  />
                </label>
              </motion.div>
            ))}
          </AnimatePresence>
        </fieldset>
      </div>
    </aside>
  );
}
