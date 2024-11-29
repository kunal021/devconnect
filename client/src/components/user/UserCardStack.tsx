import api from "@/services/axios";
import UserCard from "./UserCard";
import { User } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";

export default function UserCardStack({ data }: { data: User[] }) {
  const { showToast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);

  const mutation = useMutation({
    mutationFn: async ({
      action,
      userId,
    }: {
      action: "interested" | "ignored";
      userId: string;
    }) => {
      return await api.post(`/api/v1/connection/send/${action}/${userId}`);
    },
    onSuccess: (_, variables) => {
      const successMessage =
        variables.action === "interested"
          ? "You have expressed interest in the connection."
          : "You have ignored the connection.";

      showToast("success", successMessage, "bottom-right", 2000);
      console.log("Success");
    },
    onError: (error) => {
      showToast("error", "Error Sending Connection", "bottom-right", 2000);
      console.log("Error", error);
    },
  });

  const { mutate, isPending } = mutation;

  const handleAction = ({
    action,
    userId,
  }: {
    action: "interested" | "ignored";
    userId: string;
  }) => {
    if (currentIndex < data.length) {
      mutate({ action, userId });
      console.log(`${action} user:`, data[currentIndex]);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <AnimatePresence>
        {data &&
          data
            .slice(currentIndex, currentIndex + 3)
            .map((user: User, index: number) => (
              <motion.div
                key={user._id || index}
                className="absolute left-0 right-0 w-full"
                initial={{
                  scale: 1 - index * 0.05,
                  y: index * 20,
                  opacity: 1 - index * 0.2,
                  rotateZ: 0,
                }}
                animate={{
                  scale: 1 - index * 0.05,
                  y: index * 20,
                  opacity: 1 - index * 0.2,
                  rotateZ: 0,
                }}
                exit={{
                  x: Math.random() > 0.5 ? -200 : 200,
                  y: -100,
                  opacity: 0,
                  scale: 0.8,
                  rotateZ: Math.random() > 0.5 ? -20 : 20,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                style={{
                  zIndex: data.length - index,
                }}
              >
                <UserCard
                  user={user}
                  onConnect={() =>
                    handleAction({ action: "interested", userId: user._id! })
                  }
                  onIgnore={() =>
                    handleAction({ action: "ignored", userId: user._id! })
                  }
                  isLoading={isPending}
                />
              </motion.div>
            ))}
      </AnimatePresence>
    </div>
  );
}
