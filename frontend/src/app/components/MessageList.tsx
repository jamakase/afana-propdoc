import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
            <AnimatePresence>
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                    >
                        <div className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}