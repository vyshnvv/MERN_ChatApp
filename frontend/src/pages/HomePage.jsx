import { useChatStore } from "../store/useChatStore";
import { useChatRoomStore } from "../store/useChatRoomStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import RoomChatContainer from "../components/RoomChatContainer";
import RoomChatHeader from "../components/RoomChatHeader";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { selectedChatRoom } = useChatRoomStore();

  return (
    <div className="h-screen w-screen overflow-hidden bg-base-200 relative">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

        {/* Additional subtle orbs for depth */}
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-full blur-lg animate-pulse delay-2000"></div>
        <div className="absolute top-1/4 left-1/3 w-24 h-24 bg-gradient-to-br from-secondary/15 to-accent/15 rounded-full blur-md animate-pulse delay-3000"></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-base-content/30 rounded-full animate-float-${
                i % 3
              }`}
              style={{
                left: `${25 + i * 20}%`,
                top: `${30 + ((i * 15) % 30)}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${10 + i * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 h-full p-4 pt-20">
        <main className="w-full h-full max-w-7xl mx-auto bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden flex">
          {/* Sidebar */}
          <div className="flex-shrink-0 w-80">
            <div className="h-full">
              <Sidebar />
            </div>
          </div>

          {/* Main chat area */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Content based on selection state */}
            {!selectedUser && !selectedChatRoom && (
              <div className="flex-1 flex items-center justify-center p-4">
                <NoChatSelected />
              </div>
            )}

            {selectedUser && !selectedChatRoom && <ChatContainer />}

            {selectedChatRoom && !selectedUser && (
              <>
                <RoomChatHeader />
                <RoomChatContainer />
              </>
            )}
          </div>
        </main>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes float-0 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(180deg);
          }
        }
        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(6px) rotate(-180deg);
          }
        }
        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(90deg);
          }
        }
        .animate-float-0 {
          animation: float-0 12s ease-in-out infinite;
        }
        .animate-float-1 {
          animation: float-1 14s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 16s ease-in-out infinite;
        }

        /* Ensure proper scrolling */
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
