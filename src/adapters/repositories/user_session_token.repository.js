const { connectMysql } = require('../../middleware/db_connection');

module.exports = {
    getUserSessionTokenByToken: async (token) => {
        const query = "SELECT * from `user_session_token` WHERE `token` = ?";
        const values = [token];
        const results = await connectMysql(query, values);

        return results.length > 0 ? results[0] : {};
    },
    createUserSessionToken: async (userId, token) => {
        const now = new Date();

        const query = "INSERT INTO `user_session_token` (user_id, token, created_at, updated_at) VALUES(?,?,?,?)";
        const values = [userId, token, now, now];

        const results = await connectMysql(query, values);
        return results.insertId;
    }
}