import { z } from "zod";
import { TagNames } from "../tags";

export const RegisterValidation = z.object({
  userName: z.string().min(2, { message: "Too short" }).default(""),
  email: z.string().email().default(""),
  password: z.string().min(8, { message: "Too short" }).default(""),
});

// export const UploadValidation = z.object({
//   Name: z.string().min(1, { message: "Title is required" }).default(""),
//   Description: z.string().min(1, { message: "Title is required" }).default(""),
//   File: z.string().nonempty({ message: "Image is required" }).default(""),
//  Tags: z.array(z.enum(Object.values(TagNames))),   // tags: z.array(z.nativeEnum(TagNames)).nonempty("At least one tag is required").default([]),
// });

// export const LoginValidation = z.object({
//   email: z.string().email().default(""),
//   password: z.string().min(8, { message: "Too short" }).default(""),
// });

export const ProfileEditValidation = z.object({
  description: z.string().default(""),
  image: z.string().default(""),
});
