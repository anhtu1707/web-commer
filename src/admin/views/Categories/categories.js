import { CategoryRepository } from '../../../repositories/category.repository';
import { constants } from '../../../config/constants';
import { Notification } from '../../../utils/notification';

export class CategoriesPage {
    constructor() {
        this.initializeEventListeners();
        this.loadCategories();
    }

    async loadCategories() {
        try {
            const categories = await CategoryRepository.getCategories();
            this.renderCategories(categories);
        } catch (error) {
            console.error('Error loading categories:', error);
            Notification.error('Không thể tải danh mục. Vui lòng thử lại sau.');
        }
    }

    renderCategories(categories) {
        const tableBody = document.querySelector('#categoriesTable tbody');
        tableBody.innerHTML = categories.map(category => `
            <tr>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>${category.description || ''}</td>
                <td>${category.parent_id || 'None'}</td>
                <td>${category.status}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-btn" data-id="${category.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${category.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    initializeEventListeners() {
        // Add category form
        document.querySelector('#addCategoryForm').addEventListener('submit', async(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            try {
                await CategoryRepository.createCategory(Object.fromEntries(formData));
                Notification.success('Thêm danh mục thành công');
                this.loadCategories();
                e.target.reset();
            } catch (error) {
                console.error('Error creating category:', error);
                Notification.error(error.message || 'Không thể thêm danh mục');
            }
        });

        // Edit and delete buttons
        document.querySelector('#categoriesTable').addEventListener('click', async(e) => {
            const editBtn = e.target.closest('.edit-btn');
            const deleteBtn = e.target.closest('.delete-btn');

            if (editBtn) {
                const id = editBtn.dataset.id;
                // Handle edit
            }

            if (deleteBtn) {
                const id = deleteBtn.dataset.id;
                if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
                    try {
                        await CategoryRepository.deleteCategory(id);
                        Notification.success('Xóa danh mục thành công');
                        this.loadCategories();
                    } catch (error) {
                        console.error('Error deleting category:', error);
                        Notification.error(error.message || 'Không thể xóa danh mục');
                    }
                }
            }
        });
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    new CategoriesPage();
});