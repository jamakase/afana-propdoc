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
};

export default function Sidebar({ conversations, currentConversationId, onConversationChange, onAddConversation, onDeleteConversation }: SidebarProps) {
  const menuRef = useRef(null);

  return (
    <aside
      ref={menuRef}
      className="w-64 h-screen bg-[#17153B] flex flex-col overflow-hidden"
    >
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-white">История чатов</h2>
        
        <a
          className="group w-full p-2 mb-4 inline-block text-center rounded-full bg-gradient-to-r from-[#27005D] via-[#9400FF] to-[#AED2FF] p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
          href="/search"
        >
          <span
            className="block rounded-full bg-black px-8 py-3 text-sm font-medium group-hover:bg-transparent"
          >
            Перейти к поиску
          </span>
        </a>

        <button
          className="group w-full p-2 mb-4 inline-block text-center rounded-full bg-gradient-to-r from-[#070260] via-[#090979] to-[#00d4ff] p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75 cursor-pointer select-none"
          onClick={onAddConversation}
        >
          <span
            className="block rounded-full bg-black px-8 py-3 text-sm font-medium group-hover:bg-transparent"
          >
            Новый чат
          </span>
        </button>        
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="popLayout">
          {conversations.map((conversation) => (
            <motion.li
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
              className="mb-2 flex justify-between items-center"
            >
              <button
                className={`flex-grow text-left p-2 hover:bg-[#2E236C] rounded text-white ${currentConversationId === conversation.id ? 'bg-[#C8ACD6]' : ''}`}
                onClick={() => onConversationChange(conversation.id)}
              >
                {conversation.name}
              </button>
              <button
                onClick={() => onDeleteConversation(conversation.id)}
                className="ml-2 p-1 text-red-500 hover:text-red-700"
              >
                X
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </div>
    </aside>
  );
}
