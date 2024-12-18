import { OrderService } from '../../services/order.service.js';
import { formatCurrency, formatDate } from '../../utils/format.js';

class OrdersManager {
    constructor() {
        this.orderService = new OrderService();
        this.currentPage = 1;
        this.pageSize = 10;
        this.initializeEventListeners();
        this.loadOrders();
    }

    initializeEventListeners() {
        // Filter listeners
        document.getElementById('statusFilter').addEventListener('change', () => this.loadOrders());
        document.getElementById('dateFrom').addEventListener('change', () => this.loadOrders());
        document.getElementById('dateTo').addEventListener('change', () => this.loadOrders());
        document.getElementById('searchOrder').addEventListener('input', this.debounce(() => this.loadOrders(), 500));

        // Select all checkbox
        document.getElementById('selectAll').addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
        });

        // Update status button
        document.getElementById('updateStatusBtn').addEventListener('click', () => this.updateOrderStatus());
    }

    async loadOrders() {
        try {
            const filters = this.getFilters();
            const orders = await this.orderService.getOrders(filters);
            this.renderOrders(orders);
            this.renderPagination(orders.total);
        } catch (error) {
            console.error('Error loading orders:', error);
            // Show error notification
        }
    }

    getFilters() {
        return {
            status: document.getElementById('statusFilter').value,
            dateFrom: document.getElementById('dateFrom').value,
            dateTo: document.getElementById('dateTo').value,
            search: document.getElementById('searchOrder').value,
            page: this.currentPage,
            pageSize: this.pageSize
        };
    }

    renderOrders(orders) {
        const tbody = document.getElementById('ordersTableBody');
        tbody.innerHTML = orders.data.map(order => `
            <tr>
                <td><input type="checkbox" class="form-check-input" value="${order.id}"></td>
                <td>${order.orderNumber}</td>
                <td>${formatDate(order.orderDate)}</td>
                <td>${order.customerName}</td>
                <td>${formatCurrency(order.total)}</td>
                <td>
                    <span class="status-badge status-${order.status.toLowerCase()}">
                        ${this.getStatusText(order.status)}
                    </span>
                </td>
                <td>
                    <span class="badge bg-${order.isPaid ? 'success' : 'warning'}">
                        ${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                </td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="showOrderDetail('${order.id}')" title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="updateStatus('${order.id}')" title="Cập nhật trạng thái">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteOrder('${order.id}')" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderPagination(total) {
        const totalPages = Math.ceil(total / this.pageSize);
        const pagination = document.getElementById('ordersPagination');

        let html = `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage - 1}">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;

        for (let i = 1; i <= totalPages; i++) {
            html += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        html += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage + 1}">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        pagination.innerHTML = html;

        // Add click handlers
        pagination.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.loadOrders();
                }
            });
        });
    }

    async showOrderDetail(orderId) {
        try {
            const order = await this.orderService.getOrderDetail(orderId);
            document.getElementById('orderDetailId').textContent = order.orderNumber;

            // Render customer info
            document.getElementById('customerInfo').innerHTML = `
                <div class="customer-info-item">
                    <span class="customer-info-label">Tên:</span> ${order.customerName}
                </div>
                <div class="customer-info-item">
                    <span class="customer-info-label">Email:</span> ${order.customerEmail}
                </div>
                <div class="customer-info-item">
                    <span class="customer-info-label">Điện thoại:</span> ${order.customerPhone}
                </div>
            `;

            // Render shipping info
            document.getElementById('shippingInfo').innerHTML = `
                <div class="customer-info-item">
                    <span class="customer-info-label">Địa chỉ:</span> ${order.shippingAddress}
                </div>
                <div class="customer-info-item">
                    <span class="customer-info-label">Phương thức:</span> ${order.shippingMethod}
                </div>
            `;

            // Render order items
            document.getElementById('orderItems').innerHTML = order.items.map(item => `
                <tr>
                    <td>${item.productName}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.price * item.quantity)}</td>
                </tr>
            `).join('');

            // Render order summary
            document.getElementById('subtotal').textContent = formatCurrency(order.subtotal);
            document.getElementById('shipping').textContent = formatCurrency(order.shippingFee);
            document.getElementById('discount').textContent = formatCurrency(order.discount);
            document.getElementById('total').textContent = formatCurrency(order.total);

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('orderDetailModal'));
            modal.show();
        } catch (error) {
            console.error('Error loading order detail:', error);
            // Show error notification
        }
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Chờ xử lý',
            'processing': 'Đang xử lý',
            'shipped': 'Đang giao',
            'completed': 'Đã giao',
            'cancelled': 'Đã hủy'
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

// Initialize orders manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OrdersManager();
});