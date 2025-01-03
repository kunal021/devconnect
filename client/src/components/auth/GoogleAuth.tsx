import { Mail } from "lucide-react";
import { Button } from "../ui/button";

function GoogleAuth({ isLoading }: { isLoading: boolean }) {
  //   const mutation = useMutation({
  //     mutationFn: () => {
  //       return api.post(`/api/v1/auth/google`);
  //     },
  //     onSuccess: (data) => {
  //       login({
  //         user: data.data.user,
  //       });

  //       navigate("/home");
  //       console.log("Success logging in");
  //     },
  //     onError: (error: ApiError<LoginError>) => {
  //       console.error("Error logging in:", error);
  //     },
  //   });

  const handleGoogleLogin = async () => {
    window.location.href = import.meta.env.VITE_API_URL + "/api/v1/auth/google";
  };

  return (
    <Button
      variant="outline"
      className="w-full transition duration-300 ease-in-out"
      disabled={isLoading}
      onClick={handleGoogleLogin}
    >
      <Mail className="mr-2 h-4 w-4" /> Google
    </Button>
  );
}

export default GoogleAuth;
