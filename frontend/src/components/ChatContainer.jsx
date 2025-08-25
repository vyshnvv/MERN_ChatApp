import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import DirectMessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { CheckCheck, Download, Heart } from "lucide-react";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    sendMessage, // 1. Destructure the sendMessage function from the store
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const downloadImage = async (imageUrl, fileName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image");
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-base-200 text-center p-4">
        <h2 className="text-2xl font-bold text-base-content">
          Welcome to Chat
        </h2>
        <p className="text-lg text-base-content/60 mt-2">
          Select a conversation from the sidebar to start messaging.
        </p>
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-base-200">
        <ChatHeader />
        <div className="flex-1 overflow-hidden">
          <MessageSkeleton />
        </div>
        <div className="p-4 bg-base-100 border-t border-base-300">
          <div className="h-12 bg-base-200 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-base-200">
      <ChatHeader />

      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2 bg-base-100">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
              <Heart className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-base-content">
              Start a conversation
            </h3>
            <p className="text-base-content/70 max-w-md mt-1">
              Send a message to {selectedUser.fullName} to begin your chat.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === authUser._id;
            return (
              <div
                key={message._id}
                className={`flex gap-3 ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                {!isOwnMessage && (
                  <div className="flex-shrink-0 self-end">
                    <div className="w-10 h-10 rounded-full overflow-hidden shadow-md">
                      <img
                        src={selectedUser.profilePic || "/avatar.png"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <div
                  className={`flex flex-col max-w-xs sm:max-w-md ${
                    isOwnMessage ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`relative group/bubble ${
                      isOwnMessage
                        ? "bg-primary text-primary-content"
                        : "bg-base-300 text-base-content"
                    } rounded-xl px-4 py-2.5 break-words`}
                  >
                    {message.image && (
                      <div
                        className="mb-2 rounded-lg overflow-hidden cursor-pointer group/image relative"
                        onClick={() => window.open(message.image, "_blank")}
                      >
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="max-w-full h-auto"
                        />
                        <div
                          className="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadImage(
                              message.image,
                              `image-${message._id}`
                            );
                          }}
                        >
                          <div className="p-2 bg-base-100/20 backdrop-blur-sm rounded-full">
                            <Download className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    )}

                    {message.text && (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    )}
                  </div>

                  <div className="mt-1.5 flex items-center gap-2">
                    <time className="text-xs text-base-content/50">
                      {formatMessageTime(message.createdAt)}
                    </time>
                    {isOwnMessage && message.seen && (
                      <CheckCheck className="w-4 h-4 text-primary/70" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>

      {/* 2. Pass the function as a prop to the component */}
      <DirectMessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatContainer;
