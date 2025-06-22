// src/routes/task.routes.ts
import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} from "../controllers/task.controller";
import { protect } from "../middleware/auth.middleware"; // ✅ CORRECT
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", protect, asyncHandler(getTasks));
router.post("/", protect, asyncHandler(createTask));
router.put("/:id", protect, asyncHandler(updateTask));
router.patch("/:id/complete", protect, asyncHandler(completeTask));
router.delete("/:id", protect, asyncHandler(deleteTask));

export default router;
