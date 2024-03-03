import z from "zod";


const userSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(5),
  confirmpassword: z.string().min(5),
});


type UserDtos = z.infer<typeof userSchema>;

export { UserDtos, userSchema };
