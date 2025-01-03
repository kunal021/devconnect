import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/axios";

function GoogleCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/v1/auth/me");
        console.log("Authenticated user:", response.data.user);
        login({ user: response.data.user });
        navigate("/home");
      } catch (error) {
        console.error("Authentication failed:", error);
        setError("Failed to authenticate. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [login, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">
            Authenticating your account, please wait...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-xl text-red-500 font-semibold">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default GoogleCallback;
