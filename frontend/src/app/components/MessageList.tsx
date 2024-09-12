import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from "@/components/ui/scroll-area"


type Message = {
    id: number;
    text: string;
    sender: string;
};

type MessageListProps = {
    messages: Message[];
};

export default function MessageList({ messages }: MessageListProps) {
    return (
        <ScrollArea key={messages.length} className="flex-1 p-4 overflow-y-auto bg-white">
            <AnimatePresence>
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`mb-4 ${msg.sender === 'user' ? 'flex justify-end' : ''}`}
                    >
                        <div className={`inline-block p-2 rounded-lg max-w-[70%] break-words ${
                            msg.sender === 'user' ? 'bg-[#D958E4] text-white text-left' : 'bg-[#CDCED7] text-black text-justify'
                        }`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </ScrollArea>
    );
}