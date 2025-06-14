import { PrismaClient, UserRole, Prisma } from "@prisma/client";
import { CreateEmployeeDto, UpdateEmployeeDto } from "../types/employee.dto";
import { userService } from "./user.service";
import { generate } from "randomstring";

class EmployeeService {
  private prisma = new PrismaClient();

  public async createEmployee(employeeData: CreateEmployeeDto) {
    const { email, password, role, departmentId, managerId, ...employeeInfo } = employeeData;

    if (await this.prisma.employee.findUnique({ where: { email } })) {
      throw new Error("An employee with this email already exists.");
    }

    const employeeId = `EMP-${generate({ length: 7, charset: "numeric" })}`;
    const userPassword = password || generate(12);
    const hashedPassword = await userService.hashPassword(userPassword);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role || UserRole.EMPLOYEE,
        },
      });

      const employee = await tx.employee.create({
        data: {
          ...employeeInfo,
          employeeId,
          email,
          dateOfJoining: new Date(employeeInfo.dateOfJoining),
          dateOfBirth: employeeInfo.dateOfBirth ? new Date(employeeInfo.dateOfBirth) : undefined,
          user: {
            connect: { id: user.id },
          },
          department: {
            connect: { id: departmentId },
          },
          ...(managerId && { manager: { connect: { id: managerId } } }),
        },
      });

      return { employee, user, temporaryPassword: password ? null : userPassword };
    });
  }

  public async getAllEmployees() {
    return this.prisma.employee.findMany({
      include: {
        user: {
          select: { role: true, isActive: true },
        },
        department: true,
        manager: true,
      },
    });
  }

  public async getEmployeeById(id: string) {
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        user: true,
        department: true,
        manager: true,
        subordinates: true,
      },
    });
  }

  public async updateEmployee(id: string, employeeData: UpdateEmployeeDto) {
    const { managerId, ...restData } = employeeData;

    const data: Prisma.EmployeeUpdateInput = {
      ...restData,
      dateOfJoining: restData.dateOfJoining ? new Date(restData.dateOfJoining) : undefined,
      dateOfBirth: restData.dateOfBirth ? new Date(restData.dateOfBirth) : undefined,
    };
    
    if (managerId !== undefined) {
      if (managerId === null) {
        data.manager = { disconnect: true };
      } else {
        data.manager = { connect: { id: managerId } };
      }
    }

    return this.prisma.employee.update({
      where: { id },
      data,
    });
  }

  public async deleteEmployee(id: string) {
    return this.prisma.employee.delete({
      where: { id },
    });
  }
}

export const employeeService = new EmployeeService();