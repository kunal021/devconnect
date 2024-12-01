import { motion } from "framer-motion";
import { PostProps } from "@/types";
import { useNavigate } from "react-router-dom";
import { Loader2, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/axios";
import { useToast } from "@/hooks/useToast";

interface BlogPostsListProps {
  posts: PostProps[];
  id?: string;
}

export default function BlogPostsList({ posts, id }: BlogPostsListProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: async (postId: string) => {
      return await api.delete(`/api/v1/post/delete/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      showToast("success", "Post deleted successfully", "bottom-right", 2000);
    },
    onError: (error) => {
      showToast("error", "Error deleting post", "bottom-right", 2000);
      console.error("Error deleting post:", error);
    },
  });

  const { mutate, isPending } = mutation;

  const handleDelete = (postId: string) => mutate(postId);

  return (
    <div className="py-4 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {posts.map((post, index) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="cursor-pointer my-1"
          >
            <motion.article
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto my-3 px-3 md:px-6 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg"
            >
              {
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col mb-4"
                >
                  {!id && (
                    <div
                      onClick={() => navigate(`/posts/${post._id}`)}
                      className="flex items-center"
                    >
                      <img
                        src={post.author.profilePic}
                        alt={post.author.firstName}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-1.5 sm:mr-3"
                      />
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-green-700 dark:text-green-300">
                          {post.author.firstName}
                          {post.author.lastName
                            ? " " + post.author.lastName
                            : ""}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {new Date(post.createdAt).toDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {id && (
                    <div className="flex items-center gap-10">
                      {isPending ? (
                        <Loader2 className="animate-spin text-lime-500" />
                      ) : (
                        <Trash2
                          onClick={() => handleDelete(post._id!)}
                          className="text-red-500"
                        />
                      )}
                      {/* <PenBox className="text-blue-500 " /> */}
                    </div>
                  )}
                </motion.div>
              }
              <motion.h1
                onClick={() => navigate(`/posts/${post._id}`)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl md:text-3xl font-bold mb-4 text-green-800 dark:text-green-200"
              >
                {post.title}
              </motion.h1>
            </motion.article>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
