import { z } from "zod";

export const createAgentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
})
