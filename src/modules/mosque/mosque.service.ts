import { prisma } from "../../config/prisma.js";
import type { UpdateMosqueInput } from "./mosque.schema.js";

export const mosqueService = {
  async getById(mosqueId: string) {
    const mosque = await prisma.mosque.findUnique({
      where: { id: mosqueId },
    });

    if (!mosque) {
      throw Object.assign(new Error("Mosque not found"), { statusCode: 404 });
    }

    return mosque;
  },

  async update(mosqueId: string, input: UpdateMosqueInput) {
    const mosque = await prisma.mosque.findUnique({
      where: { id: mosqueId },
    });

    if (!mosque) {
      throw Object.assign(new Error("Mosque not found"), { statusCode: 404 });
    }

    return prisma.mosque.update({
      where: { id: mosqueId },
      data: input,
    });
  },
};