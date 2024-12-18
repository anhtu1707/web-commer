import { AuthService } from '../../services/auth.service.js';
import { Loading } from '../../utils/loading.js';
import { Notification } from '../../utils/notification.js';

class ResetPasswordManager {
    constructor() {
        this.authService = new AuthService();
        this.token = new URLSearchParams(window.location.search).get('token');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Reset Password Form Submit
        document.getElementById('resetForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleResetPassword();
        });

        // Toggle Password Visibility
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', (e) => {
                const input = e.currentTarget.previousElementSibling;
                const icon = e.currentTarget.querySelector('i');

                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });

        // Input Validation
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.classList.remove('is-invalid');
                }
            });
        });
    }

    validateForm() {
        let isValid = true;
        const newPassword = document.getElementById('newPassword');
        const confirmPassword = document.getElementById('confirmPassword');

        // Validate new password
        if (newPassword.value.length < 6) {
            newPassword.classList.add('is-invalid');
            isValid = false;
        }

        // Validate confirm password
        if (newPassword.value !== confirmPassword.value) {
            confirmPassword.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async handleResetPassword() {
        if (!this.token) {
            Notification.show('Token không hợp lệ', 'error');
            return;
        }

        if (!this.validateForm()) return;

        const newPassword = document.getElementById('newPassword').value;

        Loading.show();
        try {
            await this.authService.resetPassword(this.token, newPassword);
            Notification.show('Đặt lại mật khẩu thành công');

            // Redirect to login page after 3 seconds
            setTimeout(() => {
                window.location.href = '/admin/login';
            }, 3000);
        } catch (error) {
            Notification.show('Token đã hết hạn hoặc không hợp lệ', 'error');
        } finally {
            Loading.hide();
        }
    }
}

// Initialize reset password manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResetPasswordManager();
});