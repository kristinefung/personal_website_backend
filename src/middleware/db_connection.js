const { createPool } = require('mysql2/promise');

// Create a connection to the MySQL database
const mysqlPool = createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 3,
    maxIdle: 3, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 10000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

const connectMysql = async (query, values = null) => {
    var results;
    var connection;

    try {
        // Getting a connection from the pool
        connection = await mysqlPool.getConnection();
        [results,] = await connection.execute(query, values);
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    } finally {

        // Don't forget to release the connection when finished!
        if (connection) connection.release();
    }

    return results;
}

module.exports = {
    connectMysql: connectMysql
}