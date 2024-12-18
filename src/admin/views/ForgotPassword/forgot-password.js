import { AuthService } from '../../services/auth.service.js';
import { Loading } from '../../utils/loading.js';
import { Notification } from '../../utils/notification.js';

class ForgotPasswordManager {
    constructor() {
        this.authService = new AuthService();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Forgot Password Form Submit
        document.getElementById('forgotForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        // Input Validation
        const emailInput = document.getElementById('email');
        emailInput.addEventListener('input', () => {
            if (emailInput.value.trim()) {
                emailInput.classList.remove('is-invalid');
            }
        });
    }

    validateForm() {
        const email = document.getElementById('email');
        const emailValue = email.value.trim();

        // Validate email
        if (!emailValue || !emailValue.includes('@')) {
            email.classList.add('is-invalid');
            return false;
        }

        return true;
    }

    async handleForgotPassword() {
        if (!this.validateForm()) return;

        const email = document.getElementById('email').value;

        Loading.show();
        try {
            await this.authService.forgotPassword(email);
            Notification.show('Đã gửi email khôi phục mật khẩu', 'success');

            // Disable form after successful submission
            document.getElementById('forgotForm').reset();
            document.querySelector('button[type="submit"]').disabled = true;

            // Redirect to login page after 3 seconds
            setTimeout(() => {
                window.location.href = '/admin/login';
            }, 3000);
        } catch (error) {
            Notification.show('Email không tồn tại trong hệ thống', 'error');
        } finally {
            Loading.hide();
        }
    }
}

// Initialize forgot password manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ForgotPasswordManager();
});