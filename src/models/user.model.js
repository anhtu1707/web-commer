import { db } from '../services/database.service';

export class UserModel {
    static async findAll(options = {}) {
        const { limit = 10, offset = 0, search, role, status } = options;
        let sql = 'SELECT * FROM users WHERE 1=1';
        const params = [];

        if (search) {
            sql += ' AND (email LIKE ? OR full_name LIKE ? OR phone LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (role) {
            sql += ' AND role = ?';
            params.push(role);
        }

        if (status) {
            sql += ' AND status = ?';
            params.push(status);
        }

        sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        return await db.query(sql, params);
    }

    static async findById(id) {
        const sql = 'SELECT * FROM users WHERE id = ?';
        const results = await db.query(sql, [id]);
        return results[0];
    }

    static async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const results = await db.query(sql, [email]);
        return results[0];
    }

    static async create(data) {
        const sql = 'INSERT INTO users SET ?';
        const result = await db.query(sql, [data]);
        return result.insertId;
    }

    static async update(id, data) {
        const sql = 'UPDATE users SET ? WHERE id = ?';
        return await db.query(sql, [data, id]);
    }

    static async delete(id) {
        const sql = 'DELETE FROM users WHERE id = ?';
        return await db.query(sql, [id]);
    }

    static async changePassword(id, newPassword) {
        const sql = 'UPDATE users SET password = ? WHERE id = ?';
        return await db.query(sql, [newPassword, id]);
    }

    static async updateStatus(id, status) {
        const sql = 'UPDATE users SET status = ? WHERE id = ?';
        return await db.query(sql, [status, id]);
    }

    static async countByRole(role) {
        const sql = 'SELECT COUNT(*) as count FROM users WHERE role = ?';
        const result = await db.query(sql, [role]);
        return result[0].count;
    }
}