import { useRef, useState } from "react";
import { Image, Send } from "lucide-react";
import { useChat } from "@/hooks/useChat";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef<HTMLButtonElement | null>(null);
  const { sendMessage, selectedUser } = useChat();

  //   const handleImageChange = (e) => {
  //     const file = e.target.files[0];
  //     if (!file.type.startsWith("image/")) {
  //       toast.error("Please select an image file");
  //       return;
  //     }

  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   };

  //   const removeImage = () => {
  //     setImagePreview(null);
  //     if (fileInputRef.current) fileInputRef.current.value = "";
  //   };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage(text.trim());

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-2 w-full bg-gray-100 dark:bg-gray-900">
      {/* {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700
              flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              type="button"
              aria-label="Remove image"
            >
              <X className="w-3 h-3 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      )} */}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full px-3 py-1 text-sm sm:text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 transition-all"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {/* <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          /> */}

          <button
            type="button"
            className={`flex items-center justify-center w-10 h-10 rounded-full
                     ${
                       imagePreview
                         ? "text-emerald-500 bg-emerald-100 dark:bg-emerald-900"
                         : "text-gray-400 bg-gray-200 dark:bg-gray-700"
                     } hover:bg-opacity-80 transition-colors`}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach image"
          >
            <Image className="w-5 h-5" />
          </button>
        </div>
        <button
          type="submit"
          className={`flex items-center justify-center w-10 h-10 rounded-full
                   ${
                     text.trim() || imagePreview
                       ? "bg-lime-500 hover:bg-lime-600"
                       : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                   } transition-colors`}
          disabled={!text.trim() && !imagePreview && !selectedUser}
          aria-label="Send message"
        >
          <Send className="w-5 h-5 text-white align-middle" />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
