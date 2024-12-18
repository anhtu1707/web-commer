import { SettingsService } from '../../services/settings.service.js';
import { loadAdminLayout } from '../../utils/layout.js';

class SettingsManager {
    constructor() {
        this.settingsService = new SettingsService();
        this.initializeEventListeners();
        this.loadSettings();
    }

    initializeEventListeners() {
        // General Settings Form
        document.getElementById('generalSettingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveGeneralSettings();
        });

        // Email Settings Form
        document.getElementById('emailSettingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEmailSettings();
        });

        // Test Email Button
        document.getElementById('testEmailBtn').addEventListener('click', () => this.sendTestEmail());

        // Tab Change Event
        document.querySelectorAll('a[data-bs-toggle="tab"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', (e) => {
                const tabId = e.target.getAttribute('href').substring(1);
                this.loadTabSettings(tabId);
            });
        });
    }

    async loadSettings() {
        try {
            const settings = await this.settingsService.getSettings();
            this.populateGeneralSettings(settings);
        } catch (error) {
            console.error('Error loading settings:', error);
            // Show error notification
        }
    }

    async loadTabSettings(tabId) {
        try {
            const settings = await this.settingsService.getTabSettings(tabId);
            switch (tabId) {
                case 'general':
                    this.populateGeneralSettings(settings);
                    break;
                case 'email':
                    this.populateEmailSettings(settings);
                    break;
                    // Add other cases for different tabs
            }
        } catch (error) {
            console.error('Error loading tab settings:', error);
            // Show error notification
        }
    }

    populateGeneralSettings(settings) {
        document.getElementById('storeName').value = settings.storeName || '';
        document.getElementById('storePhone').value = settings.storePhone || '';
        document.getElementById('storeEmail').value = settings.storeEmail || '';
        document.getElementById('storeAddress').value = settings.storeAddress || '';
        document.getElementById('itemsPerPage').value = settings.itemsPerPage || 10;
        document.getElementById('currency').value = settings.currency || 'VND';
    }

    populateEmailSettings(settings) {
        document.getElementById('smtpHost').value = settings.smtpHost || '';
        document.getElementById('smtpPort').value = settings.smtpPort || '';
        document.getElementById('smtpEmail').value = settings.smtpEmail || '';
        document.getElementById('smtpPassword').value = settings.smtpPassword || '';
        document.getElementById('welcomeEmail').value = settings.welcomeEmail || '';
        document.getElementById('orderConfirmEmail').value = settings.orderConfirmEmail || '';
    }

    async saveGeneralSettings() {
        try {
            const settings = {
                storeName: document.getElementById('storeName').value,
                storePhone: document.getElementById('storePhone').value,
                storeEmail: document.getElementById('storeEmail').value,
                storeAddress: document.getElementById('storeAddress').value,
                itemsPerPage: document.getElementById('itemsPerPage').value,
                currency: document.getElementById('currency').value
            };

            await this.settingsService.saveSettings('general', settings);
            // Show success notification
        } catch (error) {
            console.error('Error saving general settings:', error);
            // Show error notification
        }
    }

    async saveEmailSettings() {
        try {
            const settings = {
                smtpHost: document.getElementById('smtpHost').value,
                smtpPort: document.getElementById('smtpPort').value,
                smtpEmail: document.getElementById('smtpEmail').value,
                smtpPassword: document.getElementById('smtpPassword').value,
                welcomeEmail: document.getElementById('welcomeEmail').value,
                orderConfirmEmail: document.getElementById('orderConfirmEmail').value
            };

            await this.settingsService.saveSettings('email', settings);
            // Show success notification
        } catch (error) {
            console.error('Error saving email settings:', error);
            // Show error notification
        }
    }

    async sendTestEmail() {
        try {
            await this.settingsService.sendTestEmail();
            // Show success notification
        } catch (error) {
            console.error('Error sending test email:', error);
            // Show error notification
        }
    }
}

// Initialize settings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', async() => {
    await loadAdminLayout();
    new SettingsManager();
});