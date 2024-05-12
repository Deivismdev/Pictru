import { z } from "zod";
import { TagNames } from "../tags";

export const RegisterValidation = z.object({
  userName: z.string().min(2, { message: "Too short" }).default(""),
  email: z.string().email().default(""),
  password: z.string().min(8, { message: "Too short" }).default(""),
});

export const UploadValidation = z.object({
  Name: z.string().min(1, { message: "Title is required" }).default(""),
  Description: z.string().min(1, { message: "Title is required" }).default(""),
  File: z.instanceof(File),
  Tags: z.array(z.nativeEnum(TagNames)).default([]),
});

export const EditValidation = z.object({
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
