import { Router } from "express";
import { 
  setupEmailConfig, 
  getEmailConfig, 
  updateEmailConfig 
} from "../controller/emailConfig.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const emailConfigRouter = Router();

// Chỉ admin mới được setup/update email config
emailConfigRouter.post("/setup", requireAuth, requireRole("TUTOR"), setupEmailConfig);
emailConfigRouter.get("/", requireAuth, getEmailConfig);
emailConfigRouter.put("/:id", requireAuth, requireRole("TUTOR"), updateEmailConfig);

export default emailConfigRouter;