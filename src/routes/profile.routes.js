import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { updateProfile, getProfile } from "../controller/profile.controller.js";

const profileRouter = Router();

profileRouter.get("/profile", requireAuth, getProfile);
profileRouter.put("/profile", requireAuth, updateProfile);

export default profileRouter;