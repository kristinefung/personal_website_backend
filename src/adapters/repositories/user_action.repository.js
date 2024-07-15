const { connectMysql } = require('../../middleware/db_connection');

module.exports = {
    getUserActionsByRoleId: async (roleId) => {
        const query = "SELECT * from `user_action` WHERE `role_id` = ?";
        const values = [roleId];

        const results = await connectMysql(query, values);
        return results;
    }
}