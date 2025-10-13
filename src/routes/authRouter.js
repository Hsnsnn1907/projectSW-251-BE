import { Router } from "express";
import authController from "../controller/auth.controller.js";
import { requireAuth } from "../middleware/auth.js"; // ← Sửa thành requireAuth
import { requireCsrf } from "../middleware/auth.js";

const authRouter = Router();

authRouter.get("/csrf", authController.csrfMethod);
authRouter.post("/signup", requireCsrf, authController.signupMethod);
authRouter.post("/login", requireCsrf, authController.loginMethod);
authRouter.post("/refresh", authController.refreshMethod);
authRouter.post("/logout", requireCsrf, authController.logoutMethod);
authRouter.get("/me", requireAuth, authController.meMethod); 
export default authRouter;