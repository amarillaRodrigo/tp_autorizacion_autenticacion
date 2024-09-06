import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js'; // Asegúrate de que la ruta sea correcta

const app = express();

// Configuración de middlewares
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});