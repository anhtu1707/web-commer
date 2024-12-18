export class ProductService {
    constructor() {
        this.apiUrl = '/api/products';
    }

    async getProducts(filters) {
        try {
            const queryParams = new URLSearchParams({
                category: filters.category,
                brand: filters.brand,
                status: filters.status,
                search: filters.search,
                page: filters.page,
                pageSize: filters.pageSize
            }).toString();

            const response = await fetch(`${this.apiUrl}?${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch products');
            return await response.json();
        } catch (error) {
            console.error('Error in getProducts:', error);
            throw error;
        }
    }

    async getProductDetail(productId) {
        try {
            const response = await fetch(`${this.apiUrl}/${productId}`);
            if (!response.ok) throw new Error('Failed to fetch product detail');
            return await response.json();
        } catch (error) {
            console.error('Error in getProductDetail:', error);
            throw error;
        }
    }

    async saveProduct(productData) {
        try {
            const formData = new FormData();
            for (let key in productData) {
                if (key === 'images') {
                    productData[key].forEach(file => {
                        formData.append('images', file);
                    });
                } else {
                    formData.append(key, productData[key]);
                }
            }

            const response = await fetch(this.apiUrl, {
                method: productData.id ? 'PUT' : 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Failed to save product');
            return await response.json();
        } catch (error) {
            console.error('Error in saveProduct:', error);
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            const response = await fetch(`${this.apiUrl}/${productId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete product');
            return true;
        } catch (error) {
            console.error('Error in deleteProduct:', error);
            throw error;
        }
    }
}