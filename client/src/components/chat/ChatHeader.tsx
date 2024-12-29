import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { X } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChat();
  const { onlineUsers } = useAuth();

  return (
    <div className="p-2.5 border-b border-lime-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser?.profilePic || "/avatar.png"}
                alt={selectedUser?.firstName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">
              {selectedUser?.firstName} {selectedUser?.lastName}
            </h3>
            <p className="text-sm text-base-content/70">
              {selectedUser && onlineUsers.includes(selectedUser?._id)
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
