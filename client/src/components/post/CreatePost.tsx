import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import api from "@/services/axios";
import { ApiError, PostError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import ErrorDisplay from "../error/ErrorDisplay";
import { Loader2 } from "lucide-react";

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const inputVariants = {
  focus: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

export default function CreatePost() {
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      return await api.post("/api/v1/post/create", data);
    },
    onSuccess: () => {
      setIsOpen(false);
      console.log("Success Updating Password");
    },
    onError: (error: ApiError<PostError>) => {
      console.error("Error Updating Password:", error);
    },
  });

  const { mutate, isPending, isError, error, isSuccess } = mutation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast("error", "Please fill in all fields.", "bottom-right", 2000);
    }
    mutate({ title, content });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{
            duration: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 10,
          }}
        >
          <Button
            variant="secondary"
            className="bg-lime-50 hover:bg-lime-100 border-2 border-lime-500 text-black transition-all duration-200 ease-in-out"
          >
            Create Post
          </Button>
        </motion.div>
      </DialogTrigger>
      <AnimatePresence>
        {isOpen && (
          <DialogContent
            className="sidebarScroll sm:max-w-[750px] max-h-[90vh] overflow-y-auto"
            forceMount
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle>Create a New Post</DialogTitle>
                <DialogDescription>
                  Fill in the details for your new post. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <motion.form
                variants={formVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit}
                className="space-y-4 mt-4"
              >
                <motion.div
                  variants={itemVariants}
                  className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  <Label
                    htmlFor={"title"}
                    className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                  >
                    Title
                  </Label>
                  <motion.div variants={inputVariants} className="relative">
                    <Input
                      id={"title"}
                      type={"text"}
                      placeholder={"Title"}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-transparent border-none text-gray-800 dark:text-white text-lg font-semibold focus:ring-0 focus:outline-none p-0 focus:shadow-none placeholder-gray-400 dark:placeholder-gray-600"
                    />
                  </motion.div>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  <Label
                    htmlFor={"content"}
                    className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                  >
                    Content
                  </Label>
                  <motion.div variants={inputVariants} className="relative">
                    <Textarea
                      id={"content"}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={"Content"}
                      className="w-full bg-transparent border-none text-gray-800 dark:text-white text-lg font-semibold focus:ring-0 focus:outline-none p-0 focus:shadow-none placeholder-gray-400 dark:placeholder-gray-600"
                    />
                  </motion.div>
                </motion.div>

                <div className="flex justify-center items-center">
                  {isError && <ErrorDisplay error={error} isError={isError} />}
                  {isSuccess && (
                    <p style={{ color: "green" }}>Post created successfully</p>
                  )}
                </div>

                <Button
                  disabled={isPending}
                  type="submit"
                  className="bg-lime-50 hover:bg-lime-100 border-2 border-lime-500 text-black transition-all duration-200 ease-in-out w-full"
                >
                  {isPending ? (
                    <>
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        fill="#84cc16"
                      />
                      Creating...
                    </>
                  ) : (
                    "Create Post"
                  )}
                </Button>
              </motion.form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
