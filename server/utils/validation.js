import zod from "zod";

export const signupSchema = zod.object({
  firstName: zod
    .string({ required_error: "First Name is required" })
    .min(3, "First Name must be atleast 3 characters")
    .max(56, "First Name must be less than 56 characters"),
  lastName: zod
    .string()
    .min(3, "Last Name must be atleast 3 characters")
    .max(56, "Last Name must be less than 56 characters")
    .optional(),
  userName: zod
    .string({ required_error: "User Name is required" })
    .min(3, "User Name must be atleast 3 characters")
    .max(56, "User Name must be less than 56 characters"),
  email: zod
    .string({ required_error: "Email is required" })
    .email()
    .min(1, "Email is required"),
  password: zod
    .string()
    .min(8, "Password must be atleast 8 characters")
    .max(56, "Password must be less than 56 characters")
    .optional(),
  providerId: zod
    .string()
    .min(1, "Firebase UID is required")
    .max(128, "Firebase UID must be less than 128 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid Firebase UID format")
    .optional(),
  age: zod.number().optional(),
  gender: zod.string().optional(),
  location: zod.string().optional(),
  bio: zod.string().max(250, "Bio must be less than 250 characters").optional(),
  profilePic: zod.string().optional(),
  skills: zod
    .array(zod.string())
    .max(10, "Skills must be less than 10")
    .optional(),
  profession: zod.string().optional(),
});

export const loginSchema = zod.object({
  loginIdentifier: zod
    .string({ required_error: "This field is required" })
    .min(1, "This field is required")
    .refine(
      (value) =>
        value.includes("@")
          ? zod.string().email().safeParse(value).success
          : true,
      {
        message: "Invalid email format",
        path: ["loginIdentifier"],
      }
    ),
  password: zod
    .string({ required_error: "Password is required" })
    .min(8, "Password must be atleast 8 characters")
    .max(56, "Password must be less than 56 characters"),
});

export const updateUserSchema = zod.object({
  firstName: zod
    .string({ required_error: "First Name is required" })
    .min(3, "First Name must be atleast 3 characters")
    .max(56, "First Name must be less than 56 characters"),
  lastName: zod
    .string()
    .min(3, "Last Name must be atleast 3 characters")
    .max(56, "Last Name must be less than 56 characters")
    .optional(),
  userName: zod
    .string({ required_error: "User Name is required" })
    .min(3, "User Name must be atleast 3 characters")
    .max(56, "User Name must be less than 56 characters"),
  age: zod.number().optional(),
  gender: zod.string().optional(),
  location: zod.string().optional(),
  bio: zod.string().max(250, "Bio must be less than 250 characters").optional(),
  skills: zod
    .array(zod.string())
    .max(10, "Skills must be less than 10")
    .optional(),
});
