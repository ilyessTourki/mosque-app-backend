import { Router } from "express";
import { getMosque, updateMosque } from "./mosque.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public — Flutter app reads mosque info
router.get("/:mosqueId", getMosque);

// Protected — only admin can update
router.put("/", authMiddleware, updateMosque);

export default router;