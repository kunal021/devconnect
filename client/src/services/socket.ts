import API_URL from "@/lib/API_URL";
import { io, Socket } from "socket.io-client";

const createSocket = (userId: string | undefined): Socket => {
  return io(API_URL, {
    withCredentials: true,
    query: { userId },
  });
};

export default createSocket;
