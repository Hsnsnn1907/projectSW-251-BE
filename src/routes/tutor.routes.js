// src/routes/tutor.routes.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/auth.js";
import { listPending, confirmSession } from "../controller/tutor.controller.js";

const tutorRoutes = Router();

// SỬA LẠI CÁC ENDPOINTS - bỏ prefix /tutor
tutorRoutes.get("/sessions/pending", requireAuth, requireRole("TUTOR"), listPending);
tutorRoutes.patch("/sessions/:id/confirm", requireAuth, requireRole("TUTOR"), confirmSession);

export default tutorRoutes;