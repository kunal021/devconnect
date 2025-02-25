import api from "@/services/axios";
import UserCard from "./UserCard";
import { User } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/useToast";

export default function UserCardStack({ data }: { data: User[] }) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ["userFeed"] });
      queryClient.setQueryData(["userFeed"], (oldData: User[]) => {
        if (!oldData) {
          return oldData;
        }
        return oldData.filter((user: User) => user._id !== variables.userId);
      });
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
    mutate({ action, userId });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div className="space-y-6" layout>
        <AnimatePresence>
          {data &&
            data?.map((user) => (
              <motion.div
                key={user._id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{
                  opacity: { duration: 0.3 },
                  layout: { type: "spring", stiffness: 300, damping: 30 },
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
      </motion.div>
    </div>
  );
}
