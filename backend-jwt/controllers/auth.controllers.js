import bcrypt from "bcryptjs";
import pool from "../db/database.js";
import { generarJwt } from "../helpers/generar-jwt.js";
import { validarJwt } from "../middlewares/validar-jwt.js";
export const controller = {
  // Endpoint de registro
  register: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    try {
      // Verificar si el usuario ya existe
      const [rows] = await pool.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
      const user = rows[0];

      if (user) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear un nuevo usuario
      await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [
        username,
        hashedPassword,
      ]);

      return res.json({ message: "Usuario registrado" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error Inesperado" });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    try {
      const [rows] = await pool.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      const token = await generarJwt(user.id);
      req.session.token = token;

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000,
      });

      return res.json({ message: "Inicio de sesión exitoso" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error Inesperado" });
    }
  },

  session: [
    validarJwt,
    (req, res) => {
      console.log(req.user);
      return res.json({
        message: "Acceso permitido a área protegida",
        user: req.user,
      });
    },
  ],

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }

      res.clearCookie("authToken");
      return res.json({ message: "Cierre de sesión exitoso" });
    });
  },
};

export default controller;
