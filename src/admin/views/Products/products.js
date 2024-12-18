import { ProductService } from '../../services/product.service.js';
import { formatCurrency } from '../../utils/format.js';

class ProductsManager {
    constructor() {
        this.productService = new ProductService();
        this.currentPage = 1;
        this.pageSize = 10;
        this.selectedImages = new Map();
        this.initializeEventListeners();
        this.loadProducts();
    }

    initializeEventListeners() {
        // Filter listeners
        document.getElementById('categoryFilter').addEventListener('change', () => this.loadProducts());
        document.getElementById('brandFilter').addEventListener('change', () => this.loadProducts());
        document.getElementById('statusFilter').addEventListener('change', () => this.loadProducts());
        document.getElementById('searchProduct').addEventListener('input', this.debounce(() => this.loadProducts(), 500));

        // Select all checkbox
        document.getElementById('selectAll').addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
        });

        // Image upload preview
        document.getElementById('productImages').addEventListener('change', (e) => this.handleImageUpload(e));

        // Save product button
        document.getElementById('saveProductBtn').addEventListener('click', () => this.saveProduct());
    }

    async loadProducts() {
        try {
            const filters = this.getFilters();
            const products = await this.productService.getProducts(filters);
            this.renderProducts(products);
            this.renderPagination(products.total);
        } catch (error) {
            console.error('Error loading products:', error);
            // Show error notification
        }
    }

    getFilters() {
        return {
            category: document.getElementById('categoryFilter').value,
            brand: document.getElementById('brandFilter').value,
            status: document.getElementById('statusFilter').value,
            search: document.getElementById('searchProduct').value,
            page: this.currentPage,
            pageSize: this.pageSize
        };
    }

    renderProducts(products) {
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = products.data.map(product => `
            <tr>
                <td><input type="checkbox" class="form-check-input" value="${product.id}"></td>
                <td>
                    <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                </td>
                <td>${product.code}</td>
                <td>${product.name}</td>
                <td>${this.getCategoryText(product.category)}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${product.stock}</td>
                <td>
                    <span class="status-badge status-${product.status.toLowerCase()}">
                        ${this.getStatusText(product.status)}
                    </span>
                </td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editProduct('${product.id}')" title="Sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    handleImageUpload(event) {
        const files = event.target.files;
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = '';

        for (let file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'image-preview-wrapper';
                wrapper.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <span class="remove-image" data-file="${file.name}">&times;</span>
                `;
                preview.appendChild(wrapper);

                // Add remove button handler
                wrapper.querySelector('.remove-image').addEventListener('click', () => {
                    wrapper.remove();
                    this.selectedImages.delete(file.name);
                });

                this.selectedImages.set(file.name, file);
            };
            reader.readAsDataURL(file);
        }
    }

    async saveProduct() {
        try {
            const productData = {
                code: document.getElementById('productCode').value,
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                brand: document.getElementById('productBrand').value,
                price: document.getElementById('productPrice').value,
                stock: document.getElementById('productStock').value,
                description: document.getElementById('productDescription').value,
                images: Array.from(this.selectedImages.values())
            };

            const response = await this.productService.saveProduct(productData);
            if (response) {
                // Show success notification
                this.loadProducts();
                bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
            }
        } catch (error) {
            console.error('Error saving product:', error);
            // Show error notification
        }
    }

    getCategoryText(category) {
        const categoryMap = {
            'laptop': 'Laptop',
            'pc': 'PC',
            'accessories': 'Phụ kiện'
        };
        return categoryMap[category] || category;
    }

    getStatusText(status) {
        const statusMap = {
            'active': 'Đang bán',
            'outOfStock': 'Hết hàng',
            'discontinued': 'Ngừng kinh doanh'
        };
        return statusMap[status] || status;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize products manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductsManager();
});