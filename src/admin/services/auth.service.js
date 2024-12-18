export class AuthService {
    constructor() {
        this.apiUrl = '/api/admin/auth';
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) throw new Error('Login failed');

            const data = await response.json();
            localStorage.setItem('adminToken', data.token);
            return data;
        } catch (error) {
            console.error('Error in login:', error);
            throw error;
        }
    }

    async forgotPassword(email) {
        try {
            const response = await fetch(`${this.apiUrl}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) throw new Error('Failed to send reset password email');
            return await response.json();
        } catch (error) {
            console.error('Error in forgotPassword:', error);
            throw error;
        }
    }

    async resetPassword(token, newPassword) {
        try {
            const response = await fetch(`${this.apiUrl}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, newPassword })
            });

            if (!response.ok) throw new Error('Failed to reset password');
            return await response.json();
        } catch (error) {
            console.error('Error in resetPassword:', error);
            throw error;
        }
    }
}