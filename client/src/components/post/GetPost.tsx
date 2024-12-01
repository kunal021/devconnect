import { useParams } from "react-router-dom";
import BlogPost from "./BlogPost";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/axios";
import StatusHandler from "../error/SatausHandler";

export default function GetPost() {
  const { postId } = useParams();

  const {
    data: post,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const response = await api.get(`/api/v1/post/get/${postId}`);
      return response.data.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <StatusHandler
        isPending={isPending}
        isError={isError}
        error={error}
        isEmpty={!post}
        emptyMessage="Post not found."
      >
        {post && <BlogPost {...post} />}
      </StatusHandler>
    </div>
  );
}
