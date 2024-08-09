const { connectMysql } = require('../../middleware/db_connection');
const { toISODate } = require('../../utils/common');

module.exports = {
    getAll: async () => {
        const query = `SELECT id, title, company_name, description, start_year_month, end_year_month, is_current, created_at, updated_at from work WHERE deleted = 0 ORDER BY start_year_month DESC, is_current DESC, end_year_month DESC`;
        const results = await connectMysql(query);
        console.log(results);

        return results;
    },
    getById: async (id) => {
        const query = `SELECT id, title, company_name, description, start_year_month, end_year_month, is_current, created_at, updated_at from work WHERE id = ? AND deleted = 0`;
        const values = [id];

        const results = await connectMysql(query, values);
        console.log(results);

        return results.length > 0 ? results[0] : {};
    },
    create: async ({ title, companyName, description, startYearMonth, endYearMonth, isCurrent }) => {
        const now = new Date();

        const query = `INSERT INTO work 
                        (title, company_name, description, start_year_month, end_year_month, is_current, created_at, updated_at) 
                        VALUES(?,?,?,?,?,?,?,?)`;
        const values = [title, companyName, description, startYearMonth, endYearMonth, isCurrent, now, now];

        const results = await connectMysql(query, values);
        console.log(results);
        return results.insertId;
    },
    updateById: async ({ id, title = null, companyName = null, description = null, startYearMonth = null, endYearMonth = null, isCurrent = null, deleted = null }) => {
        const now = new Date();

        const query = `UPDATE work
                        SET 
                            title = COALESCE(?, title), 
                            company_name = COALESCE(?, company_name), 
                            description = COALESCE(?, description), 
                            start_year_month = COALESCE(?, start_year_month), 
                            end_year_month = COALESCE(?, end_year_month), 
                            is_current = COALESCE(?, is_current), 
                            updated_at = ?,
                            deleted = COALESCE(?, deleted)
                        WHERE id = ?`;
        const values = [title, companyName, description, startYearMonth, endYearMonth, isCurrent, now, deleted, id];

        const results = await connectMysql(query, values);
        return results.changedRows;
    }
}