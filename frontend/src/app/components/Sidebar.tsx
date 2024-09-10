import { useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button"


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
      className={`fixed md:static inset-y-0 left-0 z-40 w-64 h-full pr-3 flex flex-col overflow-hidden transform 
        ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out bg-white`}
    >
      <div className="flex-1 flex flex-col min-h-0 bg-[#F6CDFA] rounded-r-[40px] overflow-hidden">
        <button
          className="md:hidden absolute top-2 right-4 text-white"
          onClick={onCloseSidebar}
        >
          ✕
        </button>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4 text-black text-center">История чатов</h2>
          
          <Link
            href="/search"
            className="w-full mb-4 inline-flex items-center justify-center text-center rounded-full bg-white focus:outline-none active:text-opacity-75 active:bg-[#EFF0F6] hover:bg-[#EFF0F6] cursor-pointer select-none transition-transform active:scale-95"
          >
            <span className="px-4 py-2 text-sm font-medium">
              Перейти к поиску
            </span>
          </Link>

          <Button 
            variant="outline" 
            onClick={onAddConversation}
            className="w-full mb-4 inline-flex items-center justify-center text-center rounded-full bg-white focus:outline-none active:text-opacity-75 active:bg-[#EFF0F6] hover:bg-[#EFF0F6] cursor-pointer select-none transition-transform active:scale-95"
          >
            <span className="px-4 py-2 text-sm font-medium">
              Новый чат
            </span>
          </Button>
        
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <fieldset className="space-y-4">
            <AnimatePresence mode="popLayout">
              {conversations.map((conversation) => (
                <Link
                  href={`/${conversation.id}`}
                  key={conversation.id}
                  onClick={(e) => {
                    e.preventDefault();
                    onConversationChange(conversation.id);
                  }}
                >
                  <label
                    htmlFor={`chat-${conversation.id}`}
                    className={`flex text-base mb-4 cursor-pointer items-center justify-between gap-4 rounded-lg border p-4 text-sm font-medium shadow-sm hover:border-[#E5A7ED] ${
                      currentConversationId === conversation.id
                      ? 'bg-[#D988E4] text-black'
                      : 'bg-[#E6E8EF] text-black'
                    }`}
                  >
                    <p>{conversation.name}</p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        height="24" 
                        viewBox="0 -960 960 960" 
                        width="24" 
                        fill="#898D9F"
                        className="hover:fill-[#E5A7ED]"
                      >
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                      </svg>
                    </button>
                    
                  </label>
                </Link>
              ))}
            </AnimatePresence>
          </fieldset>
        </div>
      </div>
    </aside>
  );
}
