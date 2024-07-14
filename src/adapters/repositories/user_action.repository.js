const { connectMysql } = require('../../middleware/db_connection');

module.exports = {
    getUserActionsByRoleId: async (roleId) => {
        var query = "SELECT * from `user_action` WHERE `role_id` = ?";
        var values = [roleId];

        var results = await connectMysql(query, values);
        return results;
    }
}