import { Router } from "express";
import { employeeController } from "../controllers/employee.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { upload } from "../config/multer.config";

const router = Router();

router.use(authMiddleware);

router.get("/profile/me", employeeController.getMyProfile);
router.post("/", employeeController.create);
router.get("/", employeeController.getAll);
router.get("/:id", employeeController.getById);
router.put("/:id", employeeController.update);
router.put("/:id/profile-picture", upload.single("profilePicture"), employeeController.uploadProfilePicture);
router.delete("/:id", employeeController.delete);

export default router;