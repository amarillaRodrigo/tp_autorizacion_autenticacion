import mysql from 'mysql2/promise';

// Crear un pool de conexiones
export const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar la conexión
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión a la base de datos exitosa');
        connection.release();
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

testConnection();

export default pool;