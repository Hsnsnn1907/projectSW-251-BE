import { Router } from "express";

import authRouter from "./authRouter.js";
import profileRouter from "./profile.routes.js";
import studentRoutes from "./student.routes.js";

const Root = Router();

Root.use("/auth", authRouter);
Root.use("/api", profileRouter);
Root.use("/api", studentRoutes);


export default Root;
