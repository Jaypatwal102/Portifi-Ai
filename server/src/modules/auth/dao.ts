import { prisma } from "../../../lib/prisma";

interface CreateUserDTO {
  name?: string | null;
  email: string;
  password: string;
  avatarUrl?: string | null;
}

export const authDao = {
  async createUser(data: CreateUserDTO) {
    return prisma.user.create({
      data: {
        name: data.name ?? null,
        email: data.email,
        password: data.password,
        avatarUrl: data.avatarUrl ?? null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  },

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  },
};
