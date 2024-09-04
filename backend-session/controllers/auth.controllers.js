import { pool } from "../db/database.js";

export const controllers = {
  register: async (req, res) => {
    const { username, password } = req.body || {};
  
    // Verificar que los campos no estén vacíos y no sean undefined
    if (!username || !password) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }
  
    try {
      const [rows] = await pool.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
      if (rows.length > 0) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }
  
      await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [
        username,
        password,
      ]);
  
      return res.json({ message: "Usuario creado exitosamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    try {
      const [rows] = await pool.query(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password]
      );
      if (rows.length === 0) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      const user = rows[0];
      req.session.userId = user.id;
      req.session.username = user.username;

      return res.json({
        message: "Inicio de sesión exitoso",
        user: { id: user.id, username: user.username },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  session: async (req, res) => {
    if (req.session.userId) {
      return res.json({
        loggedIn: true,
        user: { id: req.session.userId, username: req.session.username },
      });
    } else {
      return res
        .status(401)
        .json({ loggedIn: false, message: "No hay sesión activa" });
    }
  },

  logout: async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar la sesión" });
      }
      res.clearCookie("connect.sid");
      return res.json({ message: "Sesión cerrada exitosamente" });
    });
  },
};