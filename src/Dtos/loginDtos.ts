import z from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});


type LoginDtos = z.infer<typeof loginSchema>;

export { LoginDtos, loginSchema };
