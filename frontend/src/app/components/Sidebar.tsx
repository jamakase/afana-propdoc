import { useRef } from 'react';
import Link from 'next/link';

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
      className="w-64 h-screen bg-black flex flex-col overflow-hidden"
    >
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-white">История чатов</h2>
        <Link href="/search" className="w-full p-2 mb-4 bg-green-500 rounded-2xl text-white rounded hover:bg-green-600 inline-block text-center">
          Перейти к поиску
        </Link>
        
        <button
          onClick={onAddConversation}
          className="w-full p-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600"
        >
          Новый чат
        </button>
        
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <ul>
          {conversations.map((conversation) => (
            <li key={conversation.id} className="mb-2 flex justify-between items-center">
              <button
                className={`flex-grow text-left p-2 hover:bg-gray-700 rounded text-white ${currentConversationId === conversation.id ? 'bg-gray-700' : ''}`}
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
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
