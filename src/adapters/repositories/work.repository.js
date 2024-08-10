const { connectMysql } = require('../../middleware/db_connection');

module.exports = {
    getAll: async () => {
        const query = `
            SELECT id, title, company_name, description, start_month, start_year, end_month, end_year, is_current, created_at, updated_at 
            FROM work 
            WHERE deleted = 0
            ORDER BY 
                concat(start_year, lpad(start_month, 2, 0)) DESC, 
                is_current DESC, 
                concat(end_year, lpad(end_month, 2, 0)) DESC
            `;
        const results = await connectMysql(query);
        console.log(results);

        return results;
    },
    getById: async (id) => {
        const query = `SELECT id, title, company_name, description, start_month, start_year, end_month, end_year, is_current, created_at, updated_at from work WHERE id = ? AND deleted = 0`;
        const values = [id];

        const results = await connectMysql(query, values);
        console.log(results);

        return results.length > 0 ? results[0] : {};
    },
    create: async ({ title, companyName, description, startMonth, startYear, endMonth, endYear, isCurrent }) => {
        const now = new Date();

        const query = `INSERT INTO work 
                        (title, company_name, description, start_month, start_year, end_month, end_year, is_current, created_at, updated_at) 
                        VALUES(?,?,?,?,?,?,?,?,?,?)`;
        const values = [title, companyName, description, startMonth, startYear, endMonth, endYear, isCurrent, now, now];
        console.log(values);

        const results = await connectMysql(query, values);
        console.log(results);
        return results.insertId;
    },
    updateById: async ({ id, title = null, companyName = null, description = null, startMonth = null, startYear = null, endMonth = null, endYear = null, isCurrent = null, deleted = null }) => {
        const now = new Date();

        const query = `UPDATE work
                        SET 
                            title = COALESCE(?, title), 
                            company_name = COALESCE(?, company_name), 
                            description = COALESCE(?, description), 
                            start_month = COALESCE(?, start_month), 
                            start_year = COALESCE(?, start_year), 
                            end_month = COALESCE(?, end_month),
                            end_year = COALESCE(?, end_year),  
                            is_current = COALESCE(?, is_current), 
                            updated_at = ?,
                            deleted = COALESCE(?, deleted)
                        WHERE id = ?`;
        const values = [title, companyName, description, startMonth, startYear, endMonth, endYear, isCurrent, now, deleted, id];

        const results = await connectMysql(query, values);
        return results.changedRows;
    }
}