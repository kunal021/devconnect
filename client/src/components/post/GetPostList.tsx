import { motion } from "framer-motion";
import { PostProps } from "@/types";
import { useNavigate } from "react-router-dom";

interface BlogPostsListProps {
  posts: PostProps[];
}

export default function BlogPostsList({ posts }: BlogPostsListProps) {
  const navigate = useNavigate();
  return (
    <div className="py-12 px-4">
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
            onClick={() => navigate(`/posts/${post._id}`)}
            className="cursor-pointer my-2"
          >
            <motion.article
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto my-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center mb-4"
              >
                <img
                  src={post.author.profilePic}
                  alt={post.author.firstName}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-1.5 sm:mr-3"
                />
                <div>
                  <p className="text-sm sm:text-base font-semibold text-green-700 dark:text-green-300">
                    {post.author.firstName}
                    {post.author.lastName ? " " + post.author.lastName : ""}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {new Date(post.createdAt).toDateString()}
                  </p>
                </div>
              </motion.div>
              <motion.h1
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
