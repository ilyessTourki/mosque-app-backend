import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";

export const authService = {
  async login(input: LoginInput) {
    const admin = await prisma.admin.findUnique({
      where: { email: input.email },
      include: { mosque: true },
    });

    if (!admin) {
      throw Object.assign(new Error("Invalid email or password"), {
        statusCode: 401,
      });
    }

    const isPasswordValid = await bcrypt.compare(input.password, admin.password);

    if (!isPasswordValid) {
      throw Object.assign(new Error("Invalid email or password"), {
        statusCode: 401,
      });
    }

    const token = jwt.sign(
      { adminId: admin.id, mosqueId: admin.mosqueId, email: admin.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
    );

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        mosqueId: admin.mosqueId,
        mosqueName: admin.mosque.name,
      },
    };
  },

  async register(input: RegisterInput) {
    const existing = await prisma.admin.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw Object.assign(new Error("Email already in use"), {
        statusCode: 409,
      });
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const admin = await prisma.admin.create({
      data: {
        email: input.email,
        password: hashedPassword,
        mosqueId: input.mosqueId,
      },
    });

    return { id: admin.id, email: admin.email };
  },
};