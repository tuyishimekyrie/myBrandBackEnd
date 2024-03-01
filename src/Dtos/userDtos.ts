import z from "zod";

// Define your Zod schema
const userSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(5),
  confirmpassword: z.string().min(5),
});

// Define the DTO type using Zod's inference
type UserDtos = z.infer<typeof userSchema>;

export { UserDtos, userSchema };
