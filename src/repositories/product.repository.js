import { ProductModel } from '../models/product.model';
import { constants } from '../config/constants';

export class ProductRepository {
    static async getProducts(options = {}) {
        try {
            const products = await ProductModel.findAll(options);
            return products;
        } catch (error) {
            console.error('Error getting products:', error);
            throw error;
        }
    }

    static async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            console.error('Error getting product:', error);
            throw error;
        }
    }

    static async createProduct(data) {
        try {
            const productId = await ProductModel.create({
                ...data,
                status: constants.PRODUCT_STATUS.ACTIVE,
                created_at: new Date()
            });
            return await this.getProductById(productId);
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    static async updateProduct(id, data) {
        try {
            await ProductModel.update(id, {
                ...data,
                updated_at: new Date()
            });
            return await this.getProductById(id);
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    static async deleteProduct(id) {
        try {
            await ProductModel.delete(id);
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
}