import { useQuery } from "@tanstack/react-query";
import api from "@/services/axios";
import StatusHandler from "../components/error/SatausHandler";
import BlogPostsList from "@/components/post/GetPostList";
import CreatePost from "@/components/post/CreatePost";

export default function PostPage() {
  const {
    data: post,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await api.get(`/api/v1/post/all`);
      return response.data.data;
    },
  });

  return (
    <div className="my-4">
      <div className="mx-10 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Posts
        </h1>
        <CreatePost />
      </div>
      <StatusHandler
        isPending={isPending}
        isError={isError}
        error={error}
        isEmpty={!post || post.length === 0}
        emptyMessage="No posts found."
      >
        <BlogPostsList posts={post} />
      </StatusHandler>
    </div>
  );
}
