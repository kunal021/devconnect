import api from "@/services/axios";
import { useQuery } from "@tanstack/react-query";
import UserCardStack from "@/components/user/UserCardStack";
import StatusHandler from "@/components/error/SatausHandler";

export default function HomePage() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["userFeed"],
    queryFn: async () => {
      const response = await api.get("/api/v1/user/feed");

      return response.data.data;
    },
  });

  return (
    <div className="container mx-auto py-16">
      <StatusHandler
        isPending={isPending}
        isError={isError}
        error={error}
        isEmpty={!data || data.length === 0}
        emptyMessage="No feed data available."
      >
        {data && <UserCardStack data={data} />}
      </StatusHandler>
    </div>
  );
}
