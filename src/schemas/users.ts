import { z } from "zod";

export const SignUpSchema = z.object({
    FirstName: z.string(),
    LastName: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
});

export const AddressesSchema = z.object({
    lineOne: z.string(),
    lineTwo: z.string().nullable(),
    pincode: z.string().length(6),
    country: z.string(),
    city: z.string()
});