import { CategoryModel } from '../models/category.model';
import { constants } from '../config/constants';
import slugify from 'slugify';

export class CategoryRepository {
    static async getCategories(options = {}) {
        try {
            const categories = await CategoryModel.findAll(options);
            return categories;
        } catch (error) {
            console.error('Error getting categories:', error);
            throw error;
        }
    }

    static async getCategoryById(id) {
        try {
            const category = await CategoryModel.findById(id);
            if (!category) {
                throw new Error('Category not found');
            }
            return category;
        } catch (error) {
            console.error('Error getting category:', error);
            throw error;
        }
    }

    static async createCategory(data) {
        try {
            // Generate slug
            const slug = slugify(data.name, { lower: true });

            // Check if slug exists
            const existingCategory = await CategoryModel.findBySlug(slug);
            if (existingCategory) {
                throw new Error('Category with this name already exists');
            }

            const categoryId = await CategoryModel.create({
                ...data,
                slug,
                status: constants.CATEGORY_STATUS.ACTIVE,
                created_at: new Date()
            });

            return await this.getCategoryById(categoryId);
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    static async updateCategory(id, data) {
        try {
            if (data.name) {
                data.slug = slugify(data.name, { lower: true });
                const existingCategory = await CategoryModel.findBySlug(data.slug);
                if (existingCategory && existingCategory.id !== id) {
                    throw new Error('Category with this name already exists');
                }
            }

            await CategoryModel.update(id, {
                ...data,
                updated_at: new Date()
            });

            return await this.getCategoryById(id);
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    }

    static async deleteCategory(id) {
        try {
            // Check if category has subcategories
            const subcategories = await CategoryModel.getSubcategories(id);
            if (subcategories.length > 0) {
                throw new Error('Cannot delete category with subcategories');
            }

            await CategoryModel.delete(id);
            return true;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
}