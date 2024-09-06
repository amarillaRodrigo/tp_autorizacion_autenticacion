import mysql2 from 'mysql2/promise';

// Crear un pool de conexiones
export const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    database: 'db_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


export default pool;