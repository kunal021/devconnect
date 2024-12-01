import { PostProps } from "@/types";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function BlogPost({
  title,
  content,
  author,
  createdAt,
}: PostProps) {
  const navigate = useNavigate();
  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full p-10"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="cursor-pointer flex items-center mb-4"
        onClick={() => navigate(`/home/${author._id}`)}
      >
        <img
          src={author.profilePic}
          alt={author.firstName}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-1.5 sm:mr-3"
        />
        <div>
          <p className="text-sm sm:text-base font-semibold text-green-700 dark:text-green-300">
            {author.firstName}
            {author.lastName ? " " + author.lastName : ""}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            {new Date(createdAt).toDateString()}
          </p>
        </div>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl md:text-3xl font-bold mb-4 text-green-800 dark:text-green-200"
      >
        {title}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="prose prose-green dark:prose-invert max-w-none"
      >
        {content}
      </motion.div>
    </motion.article>
  );
}
