import { z } from "zod";
import { TagNames } from "../tags";

const passwordRequirements = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/\d/, { message: "Password must contain at least one digit" })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Password must contain at least one non-alphanumeric character",
  });

const usernameRegex = /^[a-zA-Z0-9-._@+]+$/;

export const RegisterValidation = z.object({
  userName: z
    .string()
    .min(6, { message: "Username must be at least 6 characters long" })
    .regex(usernameRegex, { message: "Username contains invalid characters" })
    .nonempty({ message: "Username is required" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .nonempty({ message: "Email is required" }),
  password: passwordRequirements.nonempty({ message: "Password is required" }),
});

export const UploadValidation = z.object({
  Name: z.string().min(1, { message: "Title is required" }).default(""),
  File: z.instanceof(File, { message: "Image is required" }),
  Tags: z
    .array(z.nativeEnum(TagNames))
    .min(1, { message: "At least one tag is required" })
    .default([]),
});

export const EditValidation = z.object({
  Name: z.string().min(1, { message: "Title is required" }).default(""),
  Description: z.string().min(1, { message: "Title is required" }).default(""),
  Tags: z.array(z.nativeEnum(TagNames)).default([]),
});

export const AppealValidation = z.object({
  Tags: z.array(z.nativeEnum(TagNames)).default([]),
});

// export const LoginValidation = z.object({
//   email: z.string().email().default(""),
//   password: z.string().min(8, { message: "Too short" }).default(""),
// });

export const ProfileEditValidation = z.object({
  description: z.string().default(""),
  image: z.string().default(""),
});
