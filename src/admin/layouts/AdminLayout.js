import { Auth } from '../utils/auth.js';
import { Notification } from '../utils/notification.js';
import { Loading } from '../utils/loading.js';

class AdminLayout {
    constructor() {
        this.checkAuth();
        this.initializeEventListeners();
        this.setActiveMenu();
    }

    async checkAuth() {
        Loading.show();
        try {
            if (!await Auth.checkAuth()) {
                return;
            }
        } catch (error) {
            Notification.show('Lỗi xác thực', 'error');
        } finally {
            Loading.hide();
        }
    }

    initializeEventListeners() {
        // Sidebar Toggle
        const sidebarCollapse = document.getElementById('sidebarCollapse');
        const sidebar = document.getElementById('sidebar');

        if (sidebarCollapse) {
            sidebarCollapse.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }

        // Logout handler
        const logoutBtn = document.querySelector('a[href="/logout"]');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async(e) => {
                e.preventDefault();
                Loading.show();
                try {
                    await Auth.logout();
                    Notification.show('Đăng xuất thành công');
                } catch (error) {
                    Notification.show('Lỗi đăng xuất', 'error');
                } finally {
                    Loading.hide();
                }
            });
        }

        // Responsive sidebar
        this.checkWidth();
        window.addEventListener('resize', () => this.checkWidth());
    }

    checkWidth() {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth <= 768) {
            sidebar.classList.add('active');
        } else {
            sidebar.classList.remove('active');
        }
    }

    setActiveMenu() {
        const currentPath = window.location.pathname;
        const menuItems = document.querySelectorAll('#sidebar .components li');

        menuItems.forEach(item => {
            const link = item.querySelector('a');
            if (link && currentPath.includes(link.getAttribute('href'))) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

// Initialize admin layout when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminLayout();
});