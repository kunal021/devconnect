import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import api from "@/services/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface ChatContextType {
  messages: Message[];
  users: string[];
  selectedUser: string | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  setSelectedUser: (user: string | null) => void;
  sendMessage: (messageData: string) => void;
  getMessages: (userId: string) => Promise<void>;
  handleSelectUser: (userId: string) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { socket } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const handleSelectUser = (userId: string) => {
    setSelectedUser(userId);
  };

  const {
    data: users,
    isLoading: isUsersLoading,
    error: userError,
    isError: isUserError,
  } = useQuery({
    queryKey: ["chatUsers"],
    queryFn: async () => {
      const response = await api.get("/api/v1/user/all-connections");
      return response.data.connections;
    },
  });

  const {
    data: messages,
    isPending: isMessagesLoading,
    error: messageError,
    isError: isMessageError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["chatMessages", currentUserId], // Dynamically include userId in queryKey
    queryFn: async () => {
      const response = await api.get(`/api/v1/chat/${currentUserId}`);
      return response.data.data;
    },
    enabled: !!currentUserId,
  });

  const getMessages = async (userId: string) => {
    setCurrentUserId(userId);
    await refetchMessages();
  };

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await api.post(`/api/v1/chat/${selectedUser}`, {
        message,
      });
      return response.data;
    },
    onSuccess: (message) => {
      // Invalidate the chat messages query for the selected user
      queryClient.setQueryData<Message[]>(
        ["chatMessages", currentUserId],
        (oldData = []) => [...oldData, message]
      );
    },
    onError: () => {
      showToast("error", "Failed to send message", "bottom-right", 2000);
    },
  });

  useEffect(() => {
    if (!selectedUser || !socket) return;
    const handleNewMessage = (message: Message) => {
      const isNewMessageFromSelectedUser = message.senderId === currentUserId;
      if (!isNewMessageFromSelectedUser) return;

      queryClient.setQueryData<Message[]>(
        ["messages", currentUserId],
        (oldData = []) => [...oldData, message]
      );
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedUser, socket, currentUserId, queryClient]);

  useEffect(() => {
    if (isUserError || userError) {
      showToast("error", "Error fetching users", "bottom-right", 2000);
    }
  }, [isUserError, userError]);

  useEffect(() => {
    if (isMessageError || messageError) {
      showToast("error", "Error fetching messages", "bottom-right", 2000);
    }
  }, [isMessageError, messageError]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        selectedUser,
        isUsersLoading,
        isMessagesLoading,
        setSelectedUser,
        sendMessage: sendMessageMutation.mutate,
        getMessages,
        handleSelectUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
