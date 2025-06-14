import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

class UserService {
  private prisma = new PrismaClient();

  public async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  public async createUser(data: any): Promise<User> {
    const hashedPassword = await this.hashPassword(data.password);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}

export const userService = new UserService();