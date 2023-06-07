import { z } from "zod";

export const createTicketSchema = z.object({
  name: z.string().min(1, "Full name is requried"),
  email: z.string().email(),
  description: z.string({ required_error: "Description is required" }).min(1, "Description is requried"),
  productNo: z.string().min(12, "Product number must be atleast 12 characters")
});
