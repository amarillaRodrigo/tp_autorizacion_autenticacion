import { Router } from "express";
import controllers from "../controllers/auth.controllers.js";

export const authRouter = Router();

authRouter.post("/register", controllers.register);

authRouter.post("/login", controllers.login);

authRouter.get("/session", controllers.session);

authRouter.post("/logout", controllers.logout);
