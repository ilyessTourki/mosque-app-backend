import { z } from "zod";

export const updateMosqueSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  address: z.string().min(1).optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  facebookUrl: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type UpdateMosqueInput = z.infer<typeof updateMosqueSchema>;