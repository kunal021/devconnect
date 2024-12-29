import ChatContainer from "@/components/chat/ChatContainer";
import NoChatSelected from "@/components/chat/NoChatSelected";
import ChatSidebar from "@/components/sidebar/chat-sidebar";
import { useChat } from "@/hooks/useChat";

function ChatPage() {
  const { selectedUser } = useChat();

  return (
    <main className="flex h-[calc(100vh-4rem)]">
      <div className="flex-shrink-0 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
        <ChatSidebar />
      </div>
      <div className="scroll flex-1 overflow-y-auto">
        {selectedUser ? <ChatContainer /> : <NoChatSelected />}
      </div>
    </main>
  );
}

export default ChatPage;
