import API_URL from "@/lib/API_URL";
import { io } from "socket.io-client";

const socket = io(API_URL, {
  withCredentials: true,
});

export default socket;
