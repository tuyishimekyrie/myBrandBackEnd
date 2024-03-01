import z from "zod";

// Define your Zod schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

// Define the DTO type using Zod's inference
type LoginDtos = z.infer<typeof loginSchema>;

export { LoginDtos, loginSchema };
