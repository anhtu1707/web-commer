export class OrderService {
    constructor() {
        this.apiUrl = '/api/orders';
    }

    async getOrders(filters) {
        try {
            const queryParams = new URLSearchParams({
                status: filters.status,
                dateFrom: filters.dateFrom,
                dateTo: filters.dateTo,
                search: filters.search,
                page: filters.page,
                pageSize: filters.pageSize
            }).toString();

            const response = await fetch(`${this.apiUrl}?${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch orders');
            return await response.json();
        } catch (error) {
            console.error('Error in getOrders:', error);
            throw error;
        }
    }

    async getOrderDetail(orderId) {
        try {
            const response = await fetch(`${this.apiUrl}/${orderId}`);
            if (!response.ok) throw new Error('Failed to fetch order detail');
            return await response.json();
        } catch (error) {
            console.error('Error in getOrderDetail:', error);
            throw error;
        }
    }

    async updateOrderStatus(orderId, status) {
        try {
            const response = await fetch(`${this.apiUrl}/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            if (!response.ok) throw new Error('Failed to update order status');
            return await response.json();
        } catch (error) {
            console.error('Error in updateOrderStatus:', error);
            throw error;
        }
    }

    async deleteOrder(orderId) {
        try {
            const response = await fetch(`${this.apiUrl}/${orderId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete order');
            return true;
        } catch (error) {
            console.error('Error in deleteOrder:', error);
            throw error;
        }
    }
}