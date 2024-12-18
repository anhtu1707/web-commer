export class Auth {
    static isAuthenticated() {
        return localStorage.getItem('adminToken') !== null;
    }

    static getToken() {
        return localStorage.getItem('adminToken');
    }

    static setToken(token) {
        localStorage.setItem('adminToken', token);
    }

    static removeToken() {
        localStorage.removeItem('adminToken');
    }

    static async checkAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/admin/login';
            return false;
        }

        try {
            const response = await fetch('/api/admin/verify-token', {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });

            if (!response.ok) {
                this.removeToken();
                window.location.href = '/admin/login';
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error checking auth:', error);
            return false;
        }
    }

    static async logout() {
        try {
            await fetch('/api/admin/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            this.removeToken();
            window.location.href = '/admin/login';
        }
    }
}