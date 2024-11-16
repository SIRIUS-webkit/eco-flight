"use client";

import { useWeb3Auth } from "@/utils/Web3AuthContext";
import React, { useState, useEffect, useRef } from "react";

interface Message {
  sender: "bot" | "user" | "loading";
  text: string;
}

const ChatBot: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const { walletAddress }: any = useWeb3Auth();
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [inputValue, setInputValue] = useState<string>("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = { sender: "user", text: inputValue };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Show loading message
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "loading", text: "..." },
    ]);
    setInputValue("");
    // Fetch the bot response
    const botResponse = await fetchBotResponse(inputValue);

    // Replace the loading message with the actual bot response
    setMessages((prevMessages) => [
      ...prevMessages.slice(0, prevMessages.length - 1), // Remove loading message
      botResponse,
    ]);
  };

  const fetchBotResponse = async (userMessage: string): Promise<Message> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AI_API}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Question: userMessage,
          wallet_address: walletAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bot response");
      }

      const data = await response.json();
      const formattedResponse = data?.Answer.split("\n")
        .map((line: any) => line.trim())
        .join("\n");
      return { sender: "bot", text: formattedResponse || "I'm here to help!" };
    } catch (error) {
      console.error("Error fetching bot response:", error);
      return { sender: "bot", text: "Sorry, something went wrong." };
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatBoxRef.current &&
        !chatBoxRef.current.contains(event.target as Node)
      ) {
        setIsChatOpen(false);
      }
    };

    if (isChatOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChatOpen]);

  return (
    <div>
      <button
        className="fixed bottom-4 right-4 btn btn-circle btn-primary shadow-lg z-50"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        💬
      </button>

      {isChatOpen && (
        <div
          ref={chatBoxRef}
          className="fixed bottom-16 right-4 w-[500px] bg-white shadow-lg rounded-lg z-[999]"
        >
          <div className="flex flex-col h-96">
            <div className="chat chat-bubble bg-white p-4 overflow-y-auto flex-grow w-full">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat ${
                    message.sender === "bot" || message.sender === "loading"
                      ? "chat-start"
                      : "chat-end"
                  }`}
                  style={{
                    marginRight: message.sender === "user" ? "8px" : "0",
                  }}
                >
                  <div
                    className={`chat-bubble ${
                      message.sender === "bot"
                        ? "chat-bubble-primary text-white"
                        : message.sender === "user"
                        ? "chat-bubble-secondary text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="flex items-center bg-gray-100 p-2 rounded-b-lg">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="input input-bordered flex-grow mr-2"
              />
              <button
                onClick={handleSend}
                className="btn btn-primary text-white"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
