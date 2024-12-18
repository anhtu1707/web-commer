export class Notification {
    static show(message, type = 'success') {
        const toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            this.createToastContainer();
        }

        const toast = document.createElement('div');
        toast.className = `toast show`;
        toast.innerHTML = `
            <div class="toast-header">
                <i class="fas fa-${this.getIcon(type)} me-2 text-${type}"></i>
                <strong class="me-auto">${this.getTitle(type)}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        document.querySelector('.toast-container').appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    static createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    static getIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    static getTitle(type) {
        const titles = {
            success: 'Thành công',
            error: 'Lỗi',
            warning: 'Cảnh báo',
            info: 'Thông báo'
        };
        return titles[type] || titles.info;
    }
}