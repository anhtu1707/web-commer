import { db } from '../services/database.service';

export class ProductModel {
    static async findAll(options = {}) {
        const { limit = 10, offset = 0, category, search } = options;
        let sql = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        if (category) {
            sql += ' AND category_id = ?';
            params.push(category);
        }

        if (search) {
            sql += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        sql += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        return await db.query(sql, params);
    }

    static async findById(id) {
        const sql = 'SELECT * FROM products WHERE id = ?';
        const results = await db.query(sql, [id]);
        return results[0];
    }

    static async create(data) {
        const sql = 'INSERT INTO products SET ?';
        const result = await db.query(sql, [data]);
        return result.insertId;
    }

    static async update(id, data) {
        const sql = 'UPDATE products SET ? WHERE id = ?';
        return await db.query(sql, [data, id]);
    }

    static async delete(id) {
        const sql = 'DELETE FROM products WHERE id = ?';
        return await db.query(sql, [id]);
    }
}