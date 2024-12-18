import { AuthService } from '../../services/auth.service.js';
import { Loading } from '../../utils/loading.js';
import { Notification } from '../../utils/notification.js';

class LoginManager {
    constructor() {
        this.authService = new AuthService();
        this.initializeEventListeners();
        this.checkRememberMe();
    }

    initializeEventListeners() {
        // Login Form Submit
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Toggle Password Visibility
        document.querySelector('.toggle-password').addEventListener('click', (e) => {
            const passwordInput = document.getElementById('password');
            const icon = e.currentTarget.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
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

    checkRememberMe() {
        const rememberedEmail = localStorage.getItem('adminEmail');
        if (rememberedEmail) {
            document.getElementById('email').value = rememberedEmail;
            document.getElementById('rememberMe').checked = true;
        }
    }

    validateForm() {
        let isValid = true;
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        // Validate email
        if (!email.value.trim() || !email.value.includes('@')) {
            email.classList.add('is-invalid');
            isValid = false;
        }

        // Validate password
        if (!password.value.trim()) {
            password.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async handleLogin() {
        if (!this.validateForm()) return;

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        Loading.show();
        try {
            const response = await this.authService.login(email, password);

            if (rememberMe) {
                localStorage.setItem('adminEmail', email);
            } else {
                localStorage.removeItem('adminEmail');
            }

            Notification.show('Đăng nhập thành công');
            window.location.href = '/admin/dashboard';
        } catch (error) {
            Notification.show('Email hoặc mật khẩu không đúng', 'error');
        } finally {
            Loading.hide();
        }
    }
}

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});