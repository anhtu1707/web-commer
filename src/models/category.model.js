import { db } from '../services/database.service';

export class CategoryModel {
    static async findAll(options = {}) {
        const { limit = 10, offset = 0, search, status } = options;
        let sql = 'SELECT * FROM categories WHERE 1=1';
        const params = [];

        if (search) {
            sql += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
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
        const sql = 'SELECT * FROM categories WHERE id = ?';
        const results = await db.query(sql, [id]);
        return results[0];
    }

    static async findBySlug(slug) {
        const sql = 'SELECT * FROM categories WHERE slug = ?';
        const results = await db.query(sql, [slug]);
        return results[0];
    }

    static async create(data) {
        const sql = 'INSERT INTO categories SET ?';
        const result = await db.query(sql, [data]);
        return result.insertId;
    }

    static async update(id, data) {
        const sql = 'UPDATE categories SET ? WHERE id = ?';
        return await db.query(sql, [data, id]);
    }

    static async delete(id) {
        const sql = 'DELETE FROM categories WHERE id = ?';
        return await db.query(sql, [id]);
    }

    static async getSubcategories(parentId) {
        const sql = 'SELECT * FROM categories WHERE parent_id = ?';
        return await db.query(sql, [parentId]);
    }
}