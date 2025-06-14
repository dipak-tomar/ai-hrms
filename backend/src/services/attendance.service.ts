import { PrismaClient, AttendanceStatus } from "@prisma/client";
import { ClockInDto, ClockOutDto } from "../types/attendance.dto";

class AttendanceService {
  private prisma = new PrismaClient();

  private async getTodaysAttendance(employeeId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.attendance.findFirst({
      where: {
        employeeId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
  }

  public async clockIn(employeeId: string, data: ClockInDto) {
    const todaysAttendance = await this.getTodaysAttendance(employeeId);

    if (todaysAttendance) {
      throw new Error("You have already clocked in today.");
    }

    return this.prisma.attendance.create({
      data: {
        employee: { connect: { id: employeeId } },
        date: new Date(),
        clockIn: new Date(),
        status: AttendanceStatus.PRESENT,
        notes: data.notes,
      },
    });
  }

  public async clockOut(employeeId: string, data: ClockOutDto) {
    const todaysAttendance = await this.getTodaysAttendance(employeeId);

    if (!todaysAttendance || !todaysAttendance.clockIn) {
      throw new Error("You have not clocked in today.");
    }

    if (todaysAttendance.clockOut) {
      throw new Error("You have already clocked out today.");
    }

    const clockOutTime = new Date();
    const clockInTime = todaysAttendance.clockIn;

    const totalMilliseconds = clockOutTime.getTime() - clockInTime.getTime();
    const totalHours = totalMilliseconds / (1000 * 60 * 60);

    return this.prisma.attendance.update({
      where: { id: todaysAttendance.id },
      data: {
        clockOut: clockOutTime,
        totalHours: parseFloat(totalHours.toFixed(2)),
        notes: todaysAttendance.notes ? `${todaysAttendance.notes}\n${data.notes}` : data.notes,
      },
    });
  }

  public async getAttendance(query: { employeeId?: string; dateFrom?: string; dateTo?: string; status?: string }) {
    const { employeeId, dateFrom, dateTo, status } = query;
    const where: any = {};

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (dateFrom && dateTo) {
      where.date = {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      };
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
  }
}

export const attendanceService = new AttendanceService();