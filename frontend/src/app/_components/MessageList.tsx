import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from 'react-markdown';

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
        <ScrollArea key={messages.length} className="flex-1 px-4 pt-4 pb-16 md:pb-0 md:px-8 md:pt-8 overflow-y-auto bg-white">
            <AnimatePresence>
                {messages.map((msg) => (
                    msg.text && (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`mb-4 ${msg.sender === 'user' ? 'flex justify-end' : ''}`}
                        >
                            <div className={`inline-block px-2 py-3 rounded-lg max-w-[70%] break-words ${
                                msg.sender === 'user' ? 'bg-[#5d76f7] text-white text-left' : 'bg-gray-300 text-black text-justify'
                            }`}>
                                {msg.sender === 'user' ? (
                                    msg.text
                                ) : (
                                    <ReactMarkdown className="markdown-content">
                                        {msg.text}
                                    </ReactMarkdown>
                                )}
                            </div>
                        </motion.div>
                    )
                ))}
            </AnimatePresence>
        </ScrollArea>
    );
}