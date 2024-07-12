import React, { useEffect, useRef } from "react";
import { Message, UserData } from "@/app/data";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "../ui/avatar";
import ChatBottombar from "./chat-bottombar";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import LikeDislikeButton from "../ui/likedislike";  // Ensure you import your component

interface ChatListProps {
    messages?: Message[];
    selectedUser: UserData;
    sendMessage: (newMessage: Message) => void;
    isMobile: boolean;
}

function isValidJSON(str: string): boolean {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

export function ChatList({
    messages,
    selectedUser,
    sendMessage,
    isMobile
}: ChatListProps) {
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
            <div ref={messagesContainerRef} className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
                <AnimatePresence>
                    {messages?.map((message, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                            transition={{
                                opacity: { duration: 0.1 },
                                layout: {
                                    type: "spring",
                                    bounce: 0.3,
                                    duration: messages.indexOf(message) * 0.05 + 0.2,
                                },
                            }}
                            className="flex flex-col gap-2 p-4 whitespace-pre-wrap w-full"
                        >
                            <div className="flex gap-3 items-center justify-start w-full">
                                <Avatar className="flex justify-center items-center">
                                    <AvatarImage src={message.avatar} alt={message.name} width={6} height={6} />
                                </Avatar>
                                <span className="bg-accent p-3 rounded-md max-w-full flex-grow">
                                    {isValidJSON(message.message) ? (
                                        <ReactMarkdown>{JSON.parse(message.message)}</ReactMarkdown>
                                    ) : (
                                        <ReactMarkdown>{message.message}</ReactMarkdown>
                                    )}
                                </span>
                            </div>
                            {message.name === 'Jane Doe' && message.processId && (
                                <LikeDislikeButton messageId={message.processId} />
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <ChatBottombar sendMessage={sendMessage} isMobile={isMobile} />
        </div>
    );
}
