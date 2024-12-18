export const constants = {
    // Product status
    PRODUCT_STATUS: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        OUT_OF_STOCK: 'out_of_stock'
    },

    // Order status
    ORDER_STATUS: {
        PENDING: 'pending',
        CONFIRMED: 'confirmed',
        SHIPPING: 'shipping',
        DELIVERED: 'delivered',
        CANCELLED: 'cancelled'
    },

    // Payment status
    PAYMENT_STATUS: {
        PENDING: 'pending',
        PAID: 'paid',
        FAILED: 'failed',
        REFUNDED: 'refunded'
    },

    // User roles
    USER_ROLES: {
        ADMIN: 'admin',
        CUSTOMER: 'customer'
    },

    // Pagination
    ITEMS_PER_PAGE: 12,

    // File upload
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB

    // Local storage keys
    STORAGE_KEYS: {
        AUTH_TOKEN: 'auth_token',
        CART_ITEMS: 'cart_items',
        USER_INFO: 'user_info'
    }
};