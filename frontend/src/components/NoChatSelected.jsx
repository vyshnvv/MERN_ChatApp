import { MessageSquare, Users, Sparkles, ArrowRight } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-8 bg-base-200 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-primary/8 to-secondary/8 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-md text-center space-y-8">
        {/* Enhanced Icon Display */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="relative group">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500">
              <MessageSquare className="w-10 h-10 text-primary-content" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-success to-success-content rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-3 h-3 text-success-content" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-warning to-warning-content rounded-full flex items-center justify-center shadow-lg">
              <Users className="w-3 h-3 text-warning-content" />
            </div>
          </div>
        </div>

        {/* Enhanced Welcome Content */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to ChatApp!
          </h2>
          <p className="text-base-content/70 text-lg leading-relaxed">
            Select a conversation from the sidebar to start chatting with your
            friends
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 gap-4 mt-8">
          <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-4 border border-base-300 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-success to-success-content rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-base-100 rounded-full animate-pulse"></div>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-base-content">
                  Real-time messaging
                </h3>
                <p className="text-sm text-base-content/70">
                  Instant message delivery
                </p>
              </div>
            </div>
          </div>

          <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-4 border border-base-300 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-info to-info-content rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-base-100 rounded-full animate-pulse delay-300"></div>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-base-content">
                  Secure & Private
                </h3>
                <p className="text-sm text-base-content/70">
                  End-to-end encryption
                </p>
              </div>
            </div>
          </div>

          <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-4 border border-base-300 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-secondary-content rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-base-100 rounded-full animate-pulse delay-600"></div>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-base-content">
                  Cross-platform
                </h3>
                <p className="text-sm text-base-content/70">
                  Sync across all devices
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-8 p-4 bg-primary/10 rounded-xl border border-primary/20">
          <div className="flex items-center justify-center gap-2 text-primary">
            <span className="text-sm font-medium">
              Choose a contact to start chatting
            </span>
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
