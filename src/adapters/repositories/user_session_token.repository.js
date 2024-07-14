const { connectMysql } = require('../../middleware/db_connection');

module.exports = {
    getUserSessionTokenByToken: async (token) => {
        var query = "SELECT * from `user_session_token` WHERE `token` = ?";
        var values = [token];

        var results = await connectMysql(query, values);

        return results[0];
    },
    createUserSessionToken: async (userId, token) => {
        var now = new Date();

        var query = "INSERT INTO `user_session_token` (user_id, token, created_at, updated_at) VALUES(?,?,?,?)";
        var values = [userId, token, now, now];

        var results = await connectMysql(query, values);
        return results.insertId;
    }
}