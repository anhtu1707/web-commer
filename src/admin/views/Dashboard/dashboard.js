document.addEventListener('DOMContentLoaded', function() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Doanh thu',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                borderColor: '#0d6efd',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Product Categories Chart
    const productCtx = document.getElementById('productChart').getContext('2d');
    new Chart(productCtx, {
        type: 'doughnut',
        data: {
            labels: ['Laptop', 'PC', 'Phụ kiện', 'Khác'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    '#0d6efd',
                    '#198754',
                    '#ffc107',
                    '#dc3545'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Load Recent Orders
    loadRecentOrders();
});

function loadRecentOrders() {
    const orders = [{
            id: 'ORD001',
            customer: 'Nguyễn Văn A',
            product: 'Laptop Acer Aspire 3',
            total: '15.990.000₫',
            status: 'Đã giao'
        },
        {
            id: 'ORD002',
            customer: 'Trần Thị B',
            product: 'PC Gaming Custom',
            total: '25.490.000₫',
            status: 'Đang xử lý'
        }
        // Add more orders as needed
    ];

    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td>${order.total}</td>
            <td><span class="badge bg-${order.status === 'Đã giao' ? 'success' : 'warning'}">${order.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-danger" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}