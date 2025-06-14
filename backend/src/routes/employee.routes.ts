import { Router } from "express";
import { employeeController } from "../controllers/employee.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", employeeController.create);
router.get("/", employeeController.getAll);
router.get("/:id", employeeController.getById);
router.put("/:id", employeeController.update);
router.delete("/:id", employeeController.delete);

export default router;