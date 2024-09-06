import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from "cors"
import morgan from "morgan"
import { authRouter } from './routes/auth.routes.js';
const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de middlewares
app.use(cors({
    origin: ['http://localhost:4000', 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    AccessControlAllowCredentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'tu_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambiar a true en producción con HTTPS
}));

// Usar el router de autenticación
app.use(authRouter);

// Iniciar el servidor

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});