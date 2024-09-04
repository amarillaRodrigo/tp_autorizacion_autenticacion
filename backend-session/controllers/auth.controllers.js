import pool from "../db/database.js";

export const controllers = {
  register: async (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    try {
      // Verificar si el usuario ya existe
      const [rows] = await pool.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
      if (rows.length > 0) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }

      // Crear nuevo usuario
      await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [
        username,
        password,
      ]);
      res.status(201).json({ message: "Usuario creado exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error del servidor" });
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

      res.status(200).json({ message: "Inicio de sesión exitoso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error del servidor" });
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
