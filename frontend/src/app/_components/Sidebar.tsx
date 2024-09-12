import { api } from '@/domain/api/api';
import { useConfig } from "@/domain/config/ConfigProvider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AnimatePresence, motion } from "framer-motion";
import { X, MessageCirclePlus } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";

type Conversation = {
  id: number;
  name: string;
  messages: Array<{ id: number; text: string; sender: string }>;
};

type SidebarProps = {
  currentConversationId: number | null | string;
  isSidebarOpen?: boolean;
  onCloseSidebar?: () => void;
  onAddConversation?: () => void;
};

export default function Sidebar({
  currentConversationId,
  onAddConversation
}: SidebarProps) {
  const router = useRouter();
  const config = useConfig();

  const queryClient = useQueryClient();

  const { data: conversations = [] } = useQuery("conversations", async () => {
    const response = await api.get_messages__user_id_(config.ENDPOINT);
    return response.data.map((id: number, index: number) => ({
      id,
      name: `Чат ${index + 1}`,
      messages: [],
    }));
  });

  const deleteConversationMutation = useMutation(
    (conversationId: number) =>
      api.deleteConversation(config.ENDPOINT, conversationId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("conversations");
        router.push("/conversations");
      },
    }
  );

  const handleDeleteConversation = (conversationId: number) => {
    deleteConversationMutation.mutate(conversationId);
  };

  return (
    <aside
      className="h-full w-20 md:w-48 md:min-w-48"
    >
      {/* <button
        className="md:hidden absolute top-2 right-5 text-black transition-all hover:text-gray-600 active:scale-90"
        onClick={onCloseSidebar}
      >
        ✕
      </button> */}
      {/* <div className="py-4 px-2 flex-1 flex flex-col items-center min-h-0 bg-gray-200 overflow-hidden w-16 min-w-16 max-w-16 m-2 mr-1 rounded-lg gap-2"> */}
      <div className="h-full bg-white border-r border-gray-200 flex-1 overflow-y-auto md:py-3 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div
          onClick={() => console.log("NEW")}
          className="flex font-semibold cursor-pointer items-center justify-center md:justify-start gap-1 border-b py-2 md:p-4 text-sm transition-all duration-500 hover:text-gray-600"
        >
          <MessageCirclePlus className="w-6 h-6" />
            <span className="hidden md:block">Начать новый чат</span>
        </div>
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
                    className={`flex cursor-pointer items-center justify-between gap-4 border-b px-2 py-3 md:p-4 text-sm font-medium ${
                      currentConversationId == conversation.id
                        ? "bg-[#5d76f7]/20 text-black font-semibold"
                        : "text-black"
                    }`}
                  >
                    <p>{conversation.name}</p>

                    <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                      className="hidden md:block"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteConversation(conversation.id);
                      }}
                    >
                      <X className="w-5 h-5 text-gray-500 hover:text-red-400" />
                    
                    </button>
            </TooltipTrigger>
            <TooltipContent side="right">Удалить чат</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        </label>

                    
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </fieldset>
      </div>
    </aside>
  );
}
