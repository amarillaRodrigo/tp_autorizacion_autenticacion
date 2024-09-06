import { Router } from "express";
import { controllers } from "../controllers/auth.controllers.js";


const authRouter = Router();

authRouter.post("/register", controllers.register);

authRouter.get("/login", controllers.login);

authRouter.get("/session", controllers.session);

authRouter.post("/logout", controllers.logout);

export default authRouter;