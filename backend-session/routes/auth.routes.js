import  express from 'express';
import { controllers } from '../controllers/auth.controllers.js';

export const authRouter = express.Router();

// registrar un usuario
authRouter.post('/register', controllers.register);

// iniciar sesión
authRouter.post('/login', controllers.login);

// obtener los datos de la sesión
authRouter.get('/session', controllers.session);

// cerrar sesión
authRouter.get('/logout', controllers.logout);

export default authRouter;