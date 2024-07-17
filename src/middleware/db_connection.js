const { createPool } = require('mysql2/promise');

// Create a connection to the MySQL database
const mysqlPool = createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    // host: 'rds-uat-sallyfunghk.ctegcsoq0n0z.us-east-1.rds.amazonaws.com',
    // port: 3306,
    // user: 'admin',
    // password: 'MFU4Ca85I9yl7TniFx55j9Dqim4L8qWSoPyGTj',
    // database: 'personal_website',
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
    const connection = await mysqlPool.getConnection();
    console.log(results);

    try {
        // Getting a connection from the pool
        connection.beginTransaction();
        [results,] = await connection.execute(query, values);
        connection.commit();
    } catch (error) {
        console.error('Error executing query:', error);
        connection.rollback();
        throw error;
    } finally {

        // Don't forget to release the connection when finished!
        if (connection) connection.release();
    }
    console.log(results);

    return results;
}

module.exports = {
    connectMysql: connectMysql
}