import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import {
  CheckCheck,
  Download,
  Heart,
  Smile,
  MoreHorizontal,
  Reply,
} from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/5 to-blue-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col min-h-0">
          <ChatHeader />
          <MessageSkeleton />
          <MessageInput />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/5 to-blue-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        <ChatHeader />

        {/* Messages Container */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
          {messages.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                <Heart className="w-12 h-12 text-purple-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-700">
                  Start a conversation
                </h3>
                <p className="text-gray-500 max-w-md">
                  Send a message to {selectedUser.fullName} to begin your chat
                </p>
              </div>
            </div>
          ) : (
            // Messages List
            messages.map((message, index) => {
              const isOwnMessage = message.senderId === authUser._id;
              const isConsecutive =
                index > 0 &&
                messages[index - 1].senderId === message.senderId &&
                new Date(message.createdAt) -
                  new Date(messages[index - 1].createdAt) <
                  60000; // 1 minute

              return (
                <div
                  key={message._id}
                  className={`flex gap-3 group ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  } ${isConsecutive ? "mt-1" : "mt-6"}`}
                >
                  {/* Avatar for received messages */}
                  {!isOwnMessage && (
                    <div
                      className={`flex-shrink-0 ${
                        isConsecutive ? "invisible" : ""
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden shadow-md border-2 border-white">
                        <img
                          src={selectedUser.profilePic || "/avatar.png"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Message Content */}
                  <div
                    className={`flex flex-col max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${
                      isOwnMessage ? "items-end" : "items-start"
                    }`}
                  >
                    {/* Sender name and time */}
                    {!isConsecutive && (
                      <div
                        className={`flex items-center gap-2 mb-1 ${
                          isOwnMessage ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <span className="text-xs font-semibold text-gray-600">
                          {isOwnMessage ? "You" : selectedUser.fullName}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatMessageTime(message.createdAt)}
                        </span>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`
                      relative group/bubble
                      ${
                        isOwnMessage
                          ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg"
                          : "bg-white/80 backdrop-blur-xl text-gray-800 shadow-lg border border-white/20"
                      }
                      rounded-2xl px-4 py-3 max-w-full break-words
                      transition-all duration-300 hover:shadow-xl
                      ${isOwnMessage ? "rounded-br-md" : "rounded-bl-md"}
                    `}
                    >
                      {/* Message Image */}
                      {message.image && (
                        <div className="mb-2">
                          <div className="relative group/image">
                            <img
                              src={message.image}
                              alt="Attachment"
                              className="max-w-full h-auto rounded-xl shadow-md transition-all duration-300 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                                <Download className="w-5 h-5 text-white" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Message Text */}
                      {message.text && (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                      )}

                      {/* Message Status (for own messages) */}
                      {isOwnMessage && (
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <CheckCheck className="w-4 h-4 text-white/70" />
                        </div>
                      )}

                      {/* Message Actions (appears on hover) */}
                      <div
                        className={`
                        absolute top-0 opacity-0 group-hover/bubble:opacity-100 transition-all duration-300
                        ${isOwnMessage ? "-left-10" : "-right-10"}
                      `}
                      >
                        <div className="flex items-center gap-1">
                          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors group">
                            <Smile className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
                          </button>
                          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors group">
                            <Reply className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
                          </button>
                          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors group">
                            <MoreHorizontal className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Consecutive message time (only shown on hover) */}
                    {isConsecutive && (
                      <div
                        className={`
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1
                        ${isOwnMessage ? "text-right" : "text-left"}
                      `}
                      >
                        <span className="text-xs text-gray-400">
                          {formatMessageTime(message.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Avatar for sent messages */}
                  {isOwnMessage && (
                    <div
                      className={`flex-shrink-0 ${
                        isConsecutive ? "invisible" : ""
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden shadow-md border-2 border-white">
                        <img
                          src={authUser.profilePic || "/avatar.png"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Scroll anchor */}
          <div ref={messageEndRef} />
        </div>

        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
