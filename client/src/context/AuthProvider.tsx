import { createContext, useCallback, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { User } from "@/types";
import { io, Socket } from "socket.io-client";
import API_URL from "@/lib/API_URL";

interface LoginType {
  user: User;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (params: LoginType) => void;
  logout: () => void;
  onlineUsers: string[];
  socket: Socket | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const connectSocket = useCallback(() => {
    {
      const userId = user?._id;

      if (!userId || socketRef.current?.connected) return;

      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const newSocket = io(API_URL, {
        query: {
          userId,
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      newSocket.connect();

      socketRef.current = newSocket;

      newSocket.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });
    }
  }, [user?._id]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const login = ({ user }: LoginType) => {
    setUser(user);
    Cookies.set("user", JSON.stringify(user));
    // connectSocket();
  };

  const logout = () => {
    disconnectSocket();
    setUser(null);
    Cookies.remove("user");
  };

  useEffect(() => {
    const fetchUser = () => {
      try {
        const currentUser = Cookies.get("user")
          ? JSON.parse(Cookies.get("user")!)
          : null;

        if (currentUser) {
          setUser(currentUser);
        }
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user?._id) {
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user?._id, connectSocket, disconnectSocket]);

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, [disconnectSocket]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        onlineUsers,
        socket: socketRef.current,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
