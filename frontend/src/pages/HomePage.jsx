import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

// ... existing imports ...

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* ... existing background elements ... */}

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen pt-20 px-4 lg:px-6">
        <div className="w-full max-w-7xl h-[calc(100vh-6rem)] flex flex-col">
          {/* ... existing header ... */}

          {/* Enhanced Chat Interface Container */}
          <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden transition-all duration-500 hover:shadow-3xl hover:bg-white/75 relative">
            {/* ... existing glassmorphism overlay ... */}

            <div className="relative z-10 flex h-full">
              {/* Sidebar */}
              <Sidebar />

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {" "}
                {/* Added overflow-hidden */}
                {/* ... existing decorative gradient border ... */}
                {/* FIXED: Removed unnecessary wrapper div */}
                {!selectedUser ? (
                  <div className="flex-1 bg-gradient-to-br from-indigo-50/50 via-white/50 to-purple-50/50 relative overflow-hidden">
                    {/* ... existing background decorations ... */}
                    <NoChatSelected />
                  </div>
                ) : (
                  <ChatContainer />
                )}
              </div>
            </div>
          </div>

          {/* ... existing footer ... */}
        </div>
      </div>

      {/* ... rest of the code ... */}
    </div>
  );
};

export default HomePage;
