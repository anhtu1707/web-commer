export class CustomerService {
    constructor() {
        this.apiUrl = '/api/customers';
    }

    async getCustomers(filters) {
        try {
            const queryParams = new URLSearchParams({
                status: filters.status,
                group: filters.group,
                search: filters.search,
                page: filters.page,
                pageSize: filters.pageSize
            }).toString();

            const response = await fetch(`${this.apiUrl}?${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch customers');
            return await response.json();
        } catch (error) {
            console.error('Error in getCustomers:', error);
            throw error;
        }
    }

    async getCustomerDetail(customerId) {
        try {
            const response = await fetch(`${this.apiUrl}/${customerId}`);
            if (!response.ok) throw new Error('Failed to fetch customer detail');
            return await response.json();
        } catch (error) {
            console.error('Error in getCustomerDetail:', error);
            throw error;
        }
    }

    async blockCustomer(customerId) {
        try {
            const response = await fetch(`${this.apiUrl}/${customerId}/block`, {
                method: 'PUT'
            });
            if (!response.ok) throw new Error('Failed to block customer');
            return await response.json();
        } catch (error) {
            console.error('Error in blockCustomer:', error);
            throw error;
        }
    }

    async exportCustomers(filters) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(`${this.apiUrl}/export?${queryParams}`);
            if (!response.ok) throw new Error('Failed to export customers');
            return await response.blob();
        } catch (error) {
            console.error('Error in exportCustomers:', error);
            throw error;
        }
    }
}