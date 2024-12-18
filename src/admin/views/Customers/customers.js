import { CustomerService } from '../../services/customer.service.js';
import { formatCurrency, formatDate } from '../../utils/format.js';

class CustomersManager {
    constructor() {
        this.customerService = new CustomerService();
        this.currentPage = 1;
        this.pageSize = 10;
        this.initializeEventListeners();
        this.loadCustomers();
    }

    initializeEventListeners() {
        // Filter listeners
        document.getElementById('statusFilter').addEventListener('change', () => this.loadCustomers());
        document.getElementById('groupFilter').addEventListener('change', () => this.loadCustomers());
        document.getElementById('searchCustomer').addEventListener('input',
            this.debounce(() => this.loadCustomers(), 500));

        // Select all checkbox
        document.getElementById('selectAll').addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
        });
    }

    async loadCustomers() {
        try {
            const filters = this.getFilters();
            const customers = await this.customerService.getCustomers(filters);
            this.renderCustomers(customers);
            this.renderPagination(customers.total);
        } catch (error) {
            console.error('Error loading customers:', error);
            // Show error notification
        }
    }

    getFilters() {
        return {
            status: document.getElementById('statusFilter').value,
            group: document.getElementById('groupFilter').value,
            search: document.getElementById('searchCustomer').value,
            page: this.currentPage,
            pageSize: this.pageSize
        };
    }

    renderCustomers(customers) {
        const tbody = document.getElementById('customersTableBody');
        tbody.innerHTML = customers.data.map(customer => `
            <tr>
                <td><input type="checkbox" class="form-check-input" value="${customer.id}"></td>
                <td>${customer.code}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>
                    <span class="group-badge group-${customer.group}">
                        ${this.getGroupText(customer.group)}
                    </span>
                </td>
                <td>${customer.orderCount}</td>
                <td>${formatCurrency(customer.totalSpent)}</td>
                <td>
                    <span class="status-badge status-${customer.status}">
                        ${this.getStatusText(customer.status)}
                    </span>
                </td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="viewCustomerDetail('${customer.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="blockCustomer('${customer.id}')">
                        <i class="fas fa-ban"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async viewCustomerDetail(customerId) {
        try {
            const customer = await this.customerService.getCustomerDetail(customerId);
            this.renderCustomerDetail(customer);
            const modal = new bootstrap.Modal(document.getElementById('customerDetailModal'));
            modal.show();
        } catch (error) {
            console.error('Error loading customer detail:', error);
            // Show error notification
        }
    }

    renderCustomerDetail(customer) {
        // Render customer info
        document.getElementById('customerInfo').innerHTML = `
            <div class="customer-info-item">
                <div class="customer-info-label">Họ tên</div>
                <div class="customer-info-value">${customer.name}</div>
            </div>
            <div class="customer-info-item">
                <div class="customer-info-label">Email</div>
                <div class="customer-info-value">${customer.email}</div>
            </div>
            <div class="customer-info-item">
                <div class="customer-info-label">Số điện thoại</div>
                <div class="customer-info-value">${customer.phone}</div>
            </div>
            <div class="customer-info-item">
                <div class="customer-info-label">Địa chỉ</div>
                <div class="customer-info-value">${customer.address}</div>
            </div>
        `;

        // Render customer stats
        document.getElementById('customerStats').innerHTML = `
            <div class="row">
                <div class="col-6">
                    <div class="customer-stats-item">
                        <div class="stats-value">${customer.orderCount}</div>
                        <div class="stats-label">Đơn hàng</div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="customer-stats-item">
                        <div class="stats-value">${formatCurrency(customer.totalSpent)}</div>
                        <div class="stats-label">Tổng chi tiêu</div>
                    </div>
                </div>
            </div>
        `;

        // Render order history
        document.getElementById('orderHistory').innerHTML = customer.orders.map(order => `
            <tr>
                <td>${order.code}</td>
                <td>${formatDate(order.createdAt)}</td>
                <td>${order.items.length} sản phẩm</td>
                <td>${formatCurrency(order.total)}</td>
                <td>
                    <span class="badge bg-${order.status === 'completed' ? 'success' : 'warning'}">
                        ${this.getOrderStatusText(order.status)}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    getStatusText(status) {
        const statusMap = {
            'active': 'Đang hoạt động',
            'inactive': 'Không hoạt động',
            'blocked': 'Đã khóa'
        };
        return statusMap[status] || status;
    }

    getGroupText(group) {
        const groupMap = {
            'regular': 'Thường xuyên',
            'vip': 'VIP',
            'wholesale': 'Bán sỉ'
        };
        return groupMap[group] || group;
    }

    getOrderStatusText(status) {
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

// Initialize customers manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CustomersManager();
});