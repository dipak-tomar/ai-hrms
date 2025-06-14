import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';

class UserService {
  private prisma = new PrismaClient();

  public async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  public async createUser(data: any): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }
}

export const userService = new UserService(); 