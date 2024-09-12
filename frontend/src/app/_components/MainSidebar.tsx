"use client"

import { Button } from "@/components/ui/button";
import { MessageCirclePlus, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

type Conversation = {
  id: number;
  name: string;
  messages: Array<{ id: number; text: string; sender: string }>;
};

type SidebarProps = {
  onAddConversation?: () => void;
};

export default function MainSidebar({ onAddConversation }: SidebarProps) {
  const pathname = usePathname();

  const isSidebarOpen = true;

  return (
    <aside
      className={`min-h-screen fixed md:static inset-y-0 left-0 z-40 h-full pr-3 flex overflow-hidden transform flex-row`}
    >
      <button
        className="md:hidden absolute top-2 right-5 text-black transition-all hover:text-gray-600 active:scale-90"
        onClick={() => {}}
      >
        ✕
      </button>
      <div className="py-4 px-2 flex-1 flex flex-col items-center min-h-0 bg-gray-200 overflow-hidden w-16 min-w-16 max-w-16 m-2 mr-1 rounded-lg gap-2">
        <h3 className="text-2xl font-bold mb-4 text-black text-center">logo</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/search"
                className={`${
                  pathname === "/search"
                    ? "bg-gray-800 text-white pointer-events-none"
                    : ""
                } 
                flex justify-center items-center 
                w-full h-12 bg-transparent text-balack rounded-lg
                transition-all duration-500
                hover:bg-white/70 active:scale-90`}
              >
                <Search className="h-6 w-6" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Поиск</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="sidebar" onClick={onAddConversation} size="xl">
                <MessageCirclePlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Новый чат</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {/* <div className="bg-white border-r border-gray-200 flex-1 overflow-y-auto py-3 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <fieldset className="">
          <AnimatePresence mode="popLayout">
            {conversations.map((conversation: any) => (
              <motion.div
                key={conversation.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                  layout: { duration: 0.3 },
                }}
              >
                <Link href={`/conversations/${conversation.id}`}>
                  <label
                    htmlFor={`chat-${conversation.id}`}
                    className={`flex cursor-pointer items-center justify-between gap-4 border-b p-4 text-sm font-medium ${
                      currentConversationId === conversation.id
                        ? "bg-indigo-100 text-black"
                        : " text-black"
                    }`}
                  >
                    <p>{conversation.name}</p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteConversation(conversation.id);
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
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                      </svg>
                    </button>
                  </label>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </fieldset>
      </div> */}
    </aside>



    // <aside
    //   ref={menuRef}
    //   className={`fixed md:static inset-y-0 left-0 z-40 w-80 h-full pr-3 flex overflow-hidden transform flex-row
    //     ${
    //     isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    //   } md:translate-x-0 transition-transform duration-300 ease-in-out bg-white`}
    // >
    //   <button
    //       className="md:hidden absolute top-2 right-5 text-black transition-all hover:text-gray-600 active:scale-90"
    //       onClick={onCloseSidebar}
    //     >
    //       ✕
    //   </button>
    //   <div className="py-4 px-3 flex-1 flex flex-col items-center min-h-0 bg-gray-200 overflow-hidden w-20 min-w-20 max-w-20 m-2 rounded-lg gap-2">
    //       <h3 className="text-2xl font-bold mb-4 text-black text-center">logo</h3>
          
    //       <Link
    //         href="/search"
    //         className={
    //           `${pathname === "/search" ? "bg-gray-800 text-white pointer-events-none" : ""} 
    //           flex justify-center items-center 
    //           w-full h-12 bg-transparent text-balack rounded-lg
    //           transition-all duration-500
    //           hover:bg-white/70 active:scale-90`
    //         }
    //       >
    //           <Search className="h-6 w-6"/>
    //       </Link>

    //       <Button 
    //         variant="sidebar" 
    //         onClick={onAddConversation}
    //         size="xl"
    //         >
    //           <MessageCirclePlus/>
    //       </Button>
    //   </div>
    // </aside>
  );
}
