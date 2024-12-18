export const routes = {
    // Public routes
    HOME: '/',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/product/:id',
    CART: '/cart',
    CHECKOUT: '/checkout',
    ACCOUNT: '/account',
    LOGIN: '/login',
    REGISTER: '/register',
    ABOUT: '/about',
    CONTACT: '/contact',

    // Policy routes
    SHOPPING_GUIDE: '/shopping-guide',
    WARRANTY_POLICY: '/warranty-policy',
    RETURN_POLICY: '/return-policy',
    SHIPPING_PAYMENT: '/shipping-payment',
    PRIVACY_POLICY: '/privacy-policy',

    // Admin routes
    ADMIN: {
        LOGIN: '/admin/login',
        DASHBOARD: '/admin/dashboard',
        PRODUCTS: '/admin/products',
        ORDERS: '/admin/orders',
        CUSTOMERS: '/admin/customers',
        CATEGORIES: '/admin/categories',
        SETTINGS: '/admin/settings'
    }
};