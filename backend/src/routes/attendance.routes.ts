import { Router } from "express";
import { attendanceController } from "../controllers/attendance.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", attendanceController.getAttendance);
router.post("/clock-in", attendanceController.clockIn);
router.post("/clock-out", attendanceController.clockOut);

export default router;