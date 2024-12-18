import { ProfileService } from '../../services/profile.service.js';
import { loadAdminLayout } from '../../utils/layout.js';
import { Loading } from '../../utils/loading.js';
import { Notification } from '../../utils/notification.js';

class ProfileManager {
    constructor() {
        this.profileService = new ProfileService();
        this.initializeEventListeners();
        this.loadProfile();
        this.loadActivities();
    }

    initializeEventListeners() {
        // Profile Image Upload
        document.getElementById('profileImage').addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files[0]);
        });

        // Profile Form
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // Security Form
        document.getElementById('securityForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });

        // Tab Change Event
        document.querySelectorAll('a[data-bs-toggle="tab"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', (e) => {
                if (e.target.getAttribute('href') === '#activity') {
                    this.loadActivities();
                }
            });
        });
    }

    async loadProfile() {
        Loading.show();
        try {
            const profile = await this.profileService.getProfile();
            this.populateProfile(profile);
        } catch (error) {
            Notification.show('Lỗi tải thông tin hồ sơ', 'error');
        } finally {
            Loading.hide();
        }
    }

    populateProfile(profile) {
        document.querySelector('.admin-name').textContent = profile.fullName;
        document.querySelector('.profile-image').src = profile.avatar || '/src/assets/images/avatar.jpg';

        document.getElementById('fullName').value = profile.fullName || '';
        document.getElementById('email').value = profile.email || '';
        document.getElementById('phone').value = profile.phone || '';
        document.getElementById('birthDate').value = profile.birthDate || '';
        document.getElementById('address').value = profile.address || '';
    }

    async handleImageUpload(file) {
        if (!file) return;

        Loading.show();
        try {
            const response = await this.profileService.uploadAvatar(file);
            document.querySelector('.profile-image').src = response.avatarUrl;
            Notification.show('Cập nhật ảnh đại diện thành công');
        } catch (error) {
            Notification.show('Lỗi upload ảnh', 'error');
        } finally {
            Loading.hide();
        }
    }

    async saveProfile() {
        Loading.show();
        try {
            const profileData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                birthDate: document.getElementById('birthDate').value,
                address: document.getElementById('address').value
            };

            await this.profileService.updateProfile(profileData);
            Notification.show('Cập nhật hồ sơ thành công');
        } catch (error) {
            Notification.show('Lỗi cập nhật hồ sơ', 'error');
        } finally {
            Loading.hide();
        }
    }

    async changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            Notification.show('Mật khẩu xác nhận không khớp', 'error');
            return;
        }

        Loading.show();
        try {
            await this.profileService.changePassword({
                currentPassword,
                newPassword
            });
            Notification.show('Đổi mật khẩu thành công');
            document.getElementById('securityForm').reset();
        } catch (error) {
            Notification.show('Lỗi đổi mật khẩu', 'error');
        } finally {
            Loading.hide();
        }
    }

    async loadActivities() {
        try {
            const activities = await this.profileService.getActivities();
            this.renderActivities(activities);
        } catch (error) {
            console.error('Error loading activities:', error);
        }
    }

    renderActivities(activities) {
        const activityList = document.querySelector('.activity-list');
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item d-flex align-items-center">
                <div class="activity-icon">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="flex-grow-1">
                    <div class="activity-text">${activity.description}</div>
                    <div class="activity-time">${this.formatDate(activity.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    getActivityIcon(type) {
        const icons = {
            login: 'sign-in-alt',
            logout: 'sign-out-alt',
            update: 'edit',
            password: 'key',
            order: 'shopping-cart'
        };
        return icons[type] || 'circle';
    }

    formatDate(timestamp) {
        return new Date(timestamp).toLocaleString('vi-VN');
    }
}

// Initialize profile manager when DOM is loaded
document.addEventListener('DOMContentLoaded', async() => {
    await loadAdminLayout();
    new ProfileManager();
});