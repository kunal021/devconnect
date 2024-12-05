import { createContext, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { User } from "@/types";
import createSocket from "@/services/socket";
import { Socket } from "socket.io-client";

interface LoginType {
  user: User;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (params: LoginType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const login = ({ user }: LoginType) => {
    setUser(user);
    Cookies.set("user", JSON.stringify(user));
    // connectSocket();
    if (user && user._id) {
      if (!socketRef.current) {
        console.log("Creating new socket instance."); // Debug log
        socketRef.current = createSocket(user._id);
      }

      if (socketRef.current) {
        console.log("Connecting socket."); // Debug log
        socketRef.current.connect();
      } else {
        console.error("Socket instance is undefined."); // Error log
      }
    } else {
      console.error("User or user._id is undefined."); // Error log
    }
  };

  const logout = () => {
    setUser(null);
    disconnectSocket();
    Cookies.remove("user");
  };

  // const connectSocket = () => {
  //   if (user && user._id) {
  //     if (!socketRef.current) {
  //       console.log("Creating new socket instance."); // Debug log
  //       socketRef.current = createSocket(user._id);
  //     }

  //     if (socketRef.current) {
  //       console.log("Connecting socket."); // Debug log
  //       socketRef.current.connect();
  //     } else {
  //       console.error("Socket instance is undefined."); // Error log
  //     }
  //   } else {
  //     console.error("User or user._id is undefined."); // Error log
  //   }
  // };

  const disconnectSocket = () => {
    if (socketRef.current) {
      console.log("Disconnecting socket."); // Debug log
      socketRef.current.disconnect();
      socketRef.current = null;
    } else {
      console.log("Socket instance already disconnected."); // Debug log
    }
  };

  useEffect(() => {
    const fetchUser = () => {
      try {
        const currentUser = Cookies.get("user")
          ? JSON.parse(Cookies.get("user")!)
          : null;

        if (currentUser) {
          setUser(currentUser);
          if (socketRef.current === null) {
            socketRef.current = createSocket(currentUser._id);
            socketRef.current.connect();
          }
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

  // useEffect(() => {
  //   if (user && user._id) {
  //     socket = createSocket(user?._id);
  //     socket.connect();
  //   }
  //   return () => {
  //     socket = createSocket(user?._id);
  //     socket.disconnect();
  //   };
  // }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
