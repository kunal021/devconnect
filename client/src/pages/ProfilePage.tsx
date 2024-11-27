import { useQuery } from "@tanstack/react-query";
import api from "@/services/axios";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserData {
  bio: string;
  createdAt: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  skills: string[];
  updatedAt: string;
  userName: string;
}

function ProfilePage() {
  const { isPending, isError, data, error } = useQuery<UserData>({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await api.get("/api/v1/user/profile");
      return response.data.user;
    },
  });

  if (isPending) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-10 h-10 animate-spin text-lime-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500 text-xl">
          Error: {(error as Error).message}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <p className="text-yellow-500 text-xl">No user data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Profile
            </h1>
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
                className="text-base py-2 px-8 bg-lime-50 hover:bg-lime-100 border-2 border-lime-500 text-black transition-all duration-200 ease-in-out"
              >
                Edit
              </Button>
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8">
            <motion.img
              src={data.profilePic}
              alt={`${data.firstName} ${data.lastName}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-lime-400"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {data.firstName} {data.lastName}
              </h2>
              <p className="text-lime-500 dark:text-lime-400">
                @{data.userName}
              </p>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {data.bio}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoCard title="Email" value={data.email} />
            <InfoCard
              title="Member Since"
              value={new Date(data.createdAt).toLocaleDateString()}
            />
            <InfoCard
              title="Last Updated"
              value={new Date(data.updatedAt).toLocaleDateString()}
            />
            <InfoCard
              title="Skills"
              value={data.skills.join(", ") || "No skills listed"}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
    >
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </h3>
      <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-gray-100">
        {value}
      </p>
    </motion.div>
  );
}

export default ProfilePage;
