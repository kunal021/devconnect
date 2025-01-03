import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { formatMessageTime } from "@/lib/utils";
import { Trash2 } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    deleteMessage,
  } = useChat();
  const { user: authUser } = useAuth();
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    if (messageEndRef?.current && messages) {
      messageEndRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleDeleteMessage = async (messageId: string) => {
    await deleteMessage(messageId);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between h-full overflow-auto">
      <ChatHeader />

      <div className="scroll flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message._id + index}
            className={`flex ${
              message.senderId === authUser?._id
                ? "flex-row-reverse"
                : "flex-row"
            } items-start gap-2 w-full`}
            ref={messageEndRef}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="size-10 rounded-full border overflow-hidden">
                <img
                  src={
                    message.senderId === authUser?._id
                      ? authUser?.profilePic || "/avatar.png"
                      : selectedUser?.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div
              className={`flex flex-col ${
                message.senderId === authUser?._id ? "items-end" : "items-start"
              }`}
            >
              {/* Timestamp */}
              <div className="mb-1">
                <time className="text-xs text-gray-500 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              {/* Message Bubble */}
              <div
                className={`relative rounded-2xl px-4 py-2 max-w-xs sm:max-w-md break-words ${
                  message.senderId === authUser?._id
                    ? "bg-lime-500 text-white rounded-tr-none"
                    : "bg-gray-700 text-white rounded-tl-none"
                }`}
              >
                {message?.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
                {message.senderId === authUser?._id && (
                  <div
                    onClick={() => handleDeleteMessage(message._id)}
                    className="absolute -left-5 top-2.5 cursor-pointer"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
