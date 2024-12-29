import { useEffect, useState } from "react";
import SidebarSkeleton from "../skeletons/SidebarSkeleton";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { User } from "@/types";

const ChatSidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChat();

  const { onlineUsers } = useAuth();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users?.filter((user: User) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full md:w-64 lg:w-72 border-r border-base-300 flex flex-col shrink-0">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <UserPlus className="size-6" />
          <span className="font-medium block">Connections</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredUsers?.map((user: User) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
                  w-full p-3 flex items-center gap-3
                  hover:bg-base-300 transition-colors
                  ${
                    selectedUser?._id === user._id
                      ? "bg-lime-500 text-black"
                      : ""
                  }
                `}
          >
            <div className="relative mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.firstName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                      rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            <div className="block text-left min-w-0">
              <div className="font-medium truncate">
                {user.firstName}
                {user.lastName ? ` ${user.lastName}` : ""}
              </div>
              <div className="text-sm text-gray-500">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {!filteredUsers ||
          (filteredUsers?.length === 0 && (
            <div className="text-center  py-4">No online users</div>
          ))}
      </div>
    </aside>
  );
};
export default ChatSidebar;
