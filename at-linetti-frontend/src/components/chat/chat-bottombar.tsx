import {
    Mic,
    SendHorizontal,
    Loader,
} from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Message, loggedInUserData, userData } from "@/app/data";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { S3, GetObjectCommand } from '@aws-sdk/client-s3';
import { testInitiate, testStatus } from "@/utils/api";
import getAgentName from "@/utils/router_agent";
import FuzzySet from 'fuzzyset.js';
import { TestType } from "@/utils/api"; 

interface ChatBottombarProps {
    sendMessage: (newMessage: Message) => void;
    isMobile: boolean;
}

interface ReadResult {
    done: boolean;
    value?: Uint8Array;
}

const testTypes: TestType[] = [
    'blog',
    'website',
    'salesforce',
    'jira'
];

export default function ChatBottombar({
    sendMessage, isMobile,
}: ChatBottombarProps) {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    const handleSend = async () => {
        if (message.trim()) {
            setIsLoading(true);
    
            const trimmedMessage = message.trim();
            const agentName = await getAgentName(trimmedMessage);

            if (!agentName) {
                const errorMessage = "I'm not sure which agent can help with that. Can you try rephrasing?";
                sendResponseMessage(errorMessage);
                setIsLoading(false);
                return;
            }
    
            // List of valid agent names
            const agents = FuzzySet(testTypes);
    
            // Find the best fuzzy match
            const matches = agents.get(agentName);
            const bestMatch = matches ? matches[0][1] : null;

    
            if (!bestMatch) {
                const noMatchMessage = "I couldn't find a matching agent for your request.";
                sendResponseMessage(noMatchMessage);
                setIsLoading(false);
                return;
            }
    
            const newMessage: Message = {
                id: trimmedMessage.length + 1,
                name: loggedInUserData.name,
                avatar: loggedInUserData.avatar,
                message: trimmedMessage,
            };
    
            sendMessage(newMessage);
            setMessage("");
    
            if (inputRef.current) {
                inputRef.current.focus();
            }
    
            try {
                // Send the message to the appropriate agent as determined by the fuzzy matching
                await handleLongRunningProcess(bestMatch as TestType, trimmedMessage);
    
            } catch (error) {
                console.error("Error during API calls:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };
    

    // Function to handle long-running processes for Python or SQL
    async function handleLongRunningProcess(type: 'blog' | 'website' | 'salesforce' | 'jira', question: string): Promise<void> {

        const processId = await testInitiate(type, question);

        if (processId) {
            const result = await testStatus(processId);
            if (result) {
                sendResponseMessage(result, processId);
            }
        }
    }


    const s3Client = new S3({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
        },
    });

    // Function to send a response message back to the UI
    function sendResponseMessage(response: string, processId?: string) {
        const responseMessage: Message = {
            id: userData[0].messages.length + 1, // Consider a more robust method for generating IDs
            name: userData[0].name,
            avatar: userData[0].avatar,
            message: response,
            processId,  // Assign the processId here if provided
        };
        userData[0].messages.push(responseMessage);
        sendMessage(responseMessage);
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }

        if (event.key === "Enter" && event.shiftKey) {
            event.preventDefault();
            setMessage((prev) => prev + "\n");
        }
    };

    return (
        <div className="p-2 flex justify-between w-full items-center gap-2">
            <div className="flex">
                <Popover>
                    <PopoverTrigger asChild>
                        <Link
                            href="#"
                            className={cn(
                                buttonVariants({ variant: "ghost", size: "icon" }),
                                "h-9 w-9",
                                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                            )}
                        >
                        </Link>
                    </PopoverTrigger>
                    <PopoverContent
                        side="top"
                        className="w-full p-2">
                        {message.trim() || isMobile ? (
                            <div className="flex gap-2">
                                <Link
                                    href="#"
                                    className={cn(
                                        buttonVariants({ variant: "ghost", size: "icon" }),
                                        "h-9 w-9",
                                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                                    )}
                                >
                                    <Mic size={20} className="text-muted-foreground" />
                                </Link>
                            </div>
                        ) : (
                            <Link
                                href="#"
                                className={cn(
                                    buttonVariants({ variant: "ghost", size: "icon" }),
                                    "h-9 w-9",
                                    "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                                )}
                            >
                                <Mic size={20} className="text-muted-foreground" />
                            </Link>
                        )}
                    </PopoverContent>
                </Popover>
            </div>

            <AnimatePresence initial={false}>
                <motion.div
                    key="input"
                    className="w-full relative"
                    layout
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{
                        opacity: { duration: 0.05 },
                        layout: {
                            type: "spring",
                            bounce: 0.15,
                        },
                    }}
                >
                    <Textarea
                        autoComplete="off"
                        value={message}
                        ref={inputRef}
                        onKeyDown={handleKeyPress}
                        onChange={handleInputChange}
                        name="message"
                        placeholder="Ask me anything..."
                        className="w-full border rounded-full flex items-center h-9 resize-none overflow-hidden bg-background"
                    ></Textarea>
                </motion.div>

                <Link
                    href="#"
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-9 w-9",
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
                    )}
                    onClick={handleSend}
                >
                    {isLoading ? (
                        <Loader className="animate-spin" />
                    ) : (
                        <SendHorizontal size={20} className="text-muted-foreground" />
                    )}
                </Link>
            </AnimatePresence>
        </div>
    );
}
