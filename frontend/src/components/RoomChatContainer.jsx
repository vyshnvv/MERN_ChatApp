import { useChatRoomStore } from "../store/useChatRoomStore";
import { useEffect, useRef } from "react";
import RoomMessageInput from "./RoomMessageInput"; // CORRECT: Imports the component with image logic
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Image, Download } from "lucide-react";
import toast from "react-hot-toast";

const RoomChatContainer = () => {
  const {
    roomMessages,
    getRoomMessages,
    isRoomMessagesLoading,
    selectedChatRoom,
    subscribeToRoomMessages,
    unsubscribeFromRoomMessages,
  } = useChatRoomStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedChatRoom?._id) {
      getRoomMessages(selectedChatRoom._id);
      subscribeToRoomMessages();
    }
    // Cleanup function to unsubscribe when the component unmounts or the room changes
    return () => unsubscribeFromRoomMessages();
  }, [
    selectedChatRoom?._id,
    getRoomMessages,
    subscribeToRoomMessages,
    unsubscribeFromRoomMessages,
  ]);

  useEffect(() => {
    // Scroll to the bottom of the message list whenever new messages are added
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [roomMessages]);

  // Function to download images
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

  if (!selectedChatRoom) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-base-200">
        <p className="text-lg text-base-content/60">
          Select a room to start chatting.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-base-200">
      {/* Message list area with vertical scrolling */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100">
        {isRoomMessagesLoading ? (
          <MessageSkeleton />
        ) : roomMessages.length === 0 ? (
          // Empty state for room with no messages
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-base-content">
                No messages yet
              </h3>
              <p className="text-base-content/70 max-w-md">
                Be the first to send a message in #{selectedChatRoom.name}
              </p>
            </div>
          </div>
        ) : (
          roomMessages.map((message) => {
            const isOwnMessage = message.senderId._id === authUser._id;
            return (
              <div
                key={message._id}
                className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
              >
                {!isOwnMessage && (
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src={message.senderId.profilePic || "/avatar.png"}
                        alt={message.senderId.fullName}
                      />
                    </div>
                  </div>
                )}

                {!isOwnMessage && (
                  <div className="chat-header">{message.senderId.fullName}</div>
                )}

                <div
                  className={`chat-bubble ${
                    isOwnMessage ? "chat-bubble-primary" : ""
                  }`}
                >
                  {/* Display text if it exists */}
                  {message.text && <p>{message.text}</p>}

                  {/* Display image if it exists */}
                  {message.image && (
                    <div className="mt-2 relative group">
                      <img
                        src={message.image}
                        alt="Shared in chat"
                        className="max-w-xs rounded-lg cursor-pointer"
                        onClick={() => window.open(message.image, "_blank")}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(
                            message.image,
                            `chat-image-${message._id}`
                          );
                        }}
                        className="absolute top-2 right-2 btn btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity bg-base-100/80 hover:bg-base-100"
                        title="Download image"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="chat-footer opacity-50">
                  <time className="text-xs flex items-center gap-1">
                    {message.image && <Image className="w-3 h-3" />}
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Message input area now correctly using the RoomMessageInput component */}
      <div className="bg-base-100 border-t border-base-300">
        <RoomMessageInput />
      </div>
    </div>
  );
};

export default RoomChatContainer;
