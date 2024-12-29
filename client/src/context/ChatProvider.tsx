import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import api from "@/services/axios";
import { User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image: string;
  isRead: boolean;
  createdAt: string;
}

interface ApiResponse {
  connections: User[];
  success: boolean;
  message?: string;
}

interface ChatContextType {
  messages: Message[];
  users: User[] | undefined;
  getUsers: () => void;
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  setSelectedUser: (user: User | null) => void;
  sendMessage: (messageData: string) => void;
  getMessages: (userId: string) => Promise<void>;
  handleSelectUser: (user: User) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { socket } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  const {
    data: users,
    isLoading: isUsersLoading,
    // error: userError,
    // isError: isUserError,
    refetch: refetchUsers,
  } = useQuery<User[]>({
    queryKey: ["chatUsers"],
    queryFn: async () => {
      const response = await api.get<ApiResponse>(
        "/api/v1/user/all-connections"
      );
      return response.data.connections;
    },
  });

  const {
    data: messages,
    isPending: isMessagesLoading,
    // error: messageError,
    // isError: isMessageError,
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
      const response = await api.post(
        `/api/v1/chat/send/${selectedUser?._id}`,
        {
          text: message,
        }
      );
      return response.data;
    },
    onSuccess: (message) => {
      // Invalidate the chat messages query for the selected user
      queryClient.setQueryData<Message[]>(
        ["chatMessages", currentUserId],
        (oldData = []) => [...oldData, message]
      );
    },
    onError: (error) => {
      showToast("error", "Failed to send message", "bottom-right", 2000);
      console.error("Failed to send message:", error);
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

  // useEffect(() => {
  //   if (!socket) return;
  //   if (isUserError || userError) {
  //     showToast("error", "Error fetching users", "bottom-right", 2000);
  //   }
  // }, [isUserError, showToast, socket, userError]);

  // useEffect(() => {
  //   if (!socket) return;
  //   if (isMessageError || messageError) {
  //     showToast("error", "Error fetching messages", "bottom-right", 2000);
  //   }
  // }, [isMessageError, messageError, showToast, socket]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        getUsers: refetchUsers,
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
