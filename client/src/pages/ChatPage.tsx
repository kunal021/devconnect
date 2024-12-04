import socket from "@/services/socket";
import { useState, useEffect } from "react";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Listen for user connection
    socket.on("user-connected", (data) => {
      console.log("User connected:", data.id);
      setUsers((prev) => [...prev, data.id]);
    });

    // Listen for user disconnection
    socket.on("user-disconnected", (data) => {
      console.log("User disconnected:", data.id);
      setUsers((prev) => prev.filter((id) => id !== data.id));
    });

    // Clean up socket listeners on unmount
    return () => {
      socket.off("message");
      socket.off("user-connected");
      socket.off("user-disconnected");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", input);
      setMessages((prev) => [...prev, { id: "You", text: input }]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          ChatPage
        </h2>
        <div className="mt-4 h-64 overflow-y-auto border rounded-lg p-2 bg-gray-50">
          {messages.map((msg, index) => (
            <p key={index} className="text-gray-700 mb-1">
              {msg.id}: {msg.text}
            </p>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message"
            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
        <div className="mt-4 text-gray-600">
          <h3 className="font-semibold">Online Users:</h3>
          <ul>
            {users.map((user, index) => (
              <li key={index} className="text-sm">
                {user}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
