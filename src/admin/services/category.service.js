export class CategoryService {
    constructor() {
        this.apiUrl = '/api/categories';
    }

    async getCategories() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('Failed to fetch categories');
            return await response.json();
        } catch (error) {
            console.error('Error in getCategories:', error);
            throw error;
        }
    }

    async getCategoryDetail(categoryId) {
        try {
            const response = await fetch(`${this.apiUrl}/${categoryId}`);
            if (!response.ok) throw new Error('Failed to fetch category detail');
            return await response.json();
        } catch (error) {
            console.error('Error in getCategoryDetail:', error);
            throw error;
        }
    }

    async saveCategory(categoryData) {
        try {
            const response = await fetch(this.apiUrl, {
                method: categoryData.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoryData)
            });
            if (!response.ok) throw new Error('Failed to save category');
            return await response.json();
        } catch (error) {
            console.error('Error in saveCategory:', error);
            throw error;
        }
    }

    async deleteCategory(categoryId) {
        try {
            const response = await fetch(`${this.apiUrl}/${categoryId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete category');
            return true;
        } catch (error) {
            console.error('Error in deleteCategory:', error);
            throw error;
        }
    }
}