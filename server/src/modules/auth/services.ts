import bcrypt from "bcryptjs";
import { authDao } from "./dao";

export const authService = {
  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  },

  async comparePassword(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  },

  async findUserByEmail(email: string) {
    return authDao.findUserByEmail(email);
  },

  async createUser(data: {
    name?: string | null;
    email: string;
    password: string;
    avatarUrl?: string | null;
  }) {
    return authDao.createUser(data);
  },
};
