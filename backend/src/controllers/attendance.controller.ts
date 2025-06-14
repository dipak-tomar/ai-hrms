import { Response } from "express";
import { attendanceService } from "../services/attendance.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { PrismaClient } from "@prisma/client";

class AttendanceController {
  private prisma = new PrismaClient();

  private async getEmployeeId(userId: string): Promise<string | null> {
    const employee = await this.prisma.employee.findUnique({
      where: { userId },
      select: { id: true },
    });
    return employee?.id || null;
  }

  public async clockIn(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const employeeId = await this.getEmployeeId(userId);
      if (!employeeId) {
        return res.status(404).json({ message: "Employee profile not found for this user." });
      }

      const attendance = await attendanceService.clockIn(employeeId, req.body);
      return res.status(201).json({ message: "Successfully clocked in.", attendance });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Server error during clock-in." });
    }
  }

  public async clockOut(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const employeeId = await this.getEmployeeId(userId);
      if (!employeeId) {
        return res.status(404).json({ message: "Employee profile not found for this user." });
      }

      const attendance = await attendanceService.clockOut(employeeId, req.body);
      return res.status(200).json({ message: "Successfully clocked out.", attendance });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Server error during clock-out." });
    }
  }

  public async getAttendance(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const attendance = await attendanceService.getAttendance(req.query);
      return res.status(200).json(attendance);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Server error while fetching attendance." });
    }
  }
}

export const attendanceController = new AttendanceController();