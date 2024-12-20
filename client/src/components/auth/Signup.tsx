import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { handleChange } from "@/lib/utils";
import api from "@/services/axios";
import { ApiError, SignupError, SignupProps } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Github, Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorDisplay from "../error/ErrorDisplay";
import { useToast } from "@/hooks/useToast";

export function Signup() {
  const { user: loggedInUser, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupProps>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    age: 0,
    gender: "",
    location: "",
    profession: "",
  });

  // console.log(formData);

  useEffect(() => {
    if (loggedInUser?._id && !authLoading) {
      navigate("/home");
    }
  }, [authLoading, loggedInUser?._id, navigate]);

  const mutation = useMutation({
    mutationFn: (data: SignupProps) => {
      return api.post(`/api/v1/auth/signup`, data);
    },
    onSuccess: () => {
      navigate("/auth/login");
      console.log("Success signing up");
    },
    onError: (error: ApiError<SignupError>) => {
      console.error("Error signing up:", error);
    },
  });

  const { mutate, isPending: isLoading, isError, error, isSuccess } = mutation;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.age <= 17) {
      showToast("error", "Age must be greater than 17", "bottom-right", 2000);
    }
    mutate(formData);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your details to create your account
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="w-full">
              <Label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                className="mt-1 w-full bg-gray-50 text-gray-700"
                placeholder="John"
                disabled={isLoading}
                value={formData.firstName}
                onChange={(e) =>
                  handleChange({ e, data: formData, setData: setFormData })
                }
              />
            </div>
            <div className="w-full">
              <Label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                className="mt-1 w-full bg-gray-50 text-gray-700"
                placeholder="Doe"
                disabled={isLoading}
                value={formData.lastName}
                onChange={(e) =>
                  handleChange({ e, data: formData, setData: setFormData })
                }
              />
            </div>
          </div>
          <div>
            <Label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700"
            >
              User Name
            </Label>
            <Input
              id="userName"
              name="userName"
              type="text"
              autoComplete="username"
              required
              className="mt-1 w-full bg-gray-50 text-gray-700"
              placeholder="johndoe"
              disabled={isLoading}
              value={formData.userName}
              onChange={(e) =>
                handleChange({ e, data: formData, setData: setFormData })
              }
            />
          </div>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 w-full bg-gray-50 text-gray-700"
              placeholder="you@example.com"
              disabled={isLoading}
              value={formData.email}
              onChange={(e) =>
                handleChange({ e, data: formData, setData: setFormData })
              }
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 w-full bg-gray-50 text-gray-700"
              placeholder="••••••••"
              disabled={isLoading}
              value={formData.password}
              onChange={(e) =>
                handleChange({ e, data: formData, setData: setFormData })
              }
            />
          </div>
          <div>
            <Label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Age
            </Label>
            <Input
              id="age"
              name="age"
              type="number"
              min={17}
              required
              className="mt-1 w-full bg-gray-50 text-gray-700"
              placeholder="25"
              disabled={isLoading}
              value={formData.age}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  age: parseInt(e.target.value),
                }))
              }
            />
          </div>
          {/* <div>
            <Label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </Label>
            <Select
              name="gender"
              required
              disabled={isLoading}
              value={formData.gender}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, gender: value }))
              }
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </Select>
          </div> */}
          <div>
            <Label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </Label>
            <Input
              id="location"
              name="location"
              type="text"
              required
              className="mt-1 w-full bg-gray-50 text-gray-700"
              placeholder="City, Country"
              disabled={isLoading}
              value={formData.location}
              onChange={(e) =>
                handleChange({ e, data: formData, setData: setFormData })
              }
            />
          </div>
          <div>
            <Label
              htmlFor="profession"
              className="block text-sm font-medium text-gray-700"
            >
              Profession
            </Label>
            <Input
              id="profession"
              name="profession"
              type="text"
              required
              className="mt-1 w-full bg-gray-50 text-gray-700"
              placeholder="Software Developer"
              disabled={isLoading}
              value={formData.profession}
              onChange={(e) =>
                handleChange({ e, data: formData, setData: setFormData })
              }
            />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing up...
              </>
            ) : (
              "Sign up"
            )}
          </Button>
        </div>
      </form>

      <div className="flex justify-center items-center">
        {/* {isError && (
          <p style={{ color: "red" }}>
            Error:{" "}
            {error.response?.data.error || "An unexpected error occurred"}
          </p>
        )} */}

        <ErrorDisplay isError={isError} error={error} />
        {isSuccess && <p style={{ color: "green" }}>Signup successful!</p>}
      </div>

      <div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full transition duration-300 ease-in-out"
            disabled={isLoading}
          >
            <Mail className="mr-2 h-4 w-4" /> Google
          </Button>
          <Button
            variant="outline"
            className="w-full transition duration-300 ease-in-out"
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" /> GitHub
          </Button>
        </div>
      </div>

      <p className="mt-2 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to={"/auth/login"}>
          <Button
            variant="link"
            className="p-0 h-auto font-semibold text-indigo-600 hover:text-indigo-500"
            disabled={isLoading}
          >
            Log in
          </Button>
        </Link>
      </p>
    </div>
  );
}
