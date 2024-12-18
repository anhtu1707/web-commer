export class SettingsService {
    constructor() {
        this.apiUrl = '/api/settings';
    }

    async getSettings() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('Failed to fetch settings');
            return await response.json();
        } catch (error) {
            console.error('Error in getSettings:', error);
            throw error;
        }
    }

    async getTabSettings(tabId) {
        try {
            const response = await fetch(`${this.apiUrl}/${tabId}`);
            if (!response.ok) throw new Error('Failed to fetch tab settings');
            return await response.json();
        } catch (error) {
            console.error('Error in getTabSettings:', error);
            throw error;
        }
    }

    async saveSettings(type, settings) {
        try {
            const response = await fetch(`${this.apiUrl}/${type}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });
            if (!response.ok) throw new Error('Failed to save settings');
            return await response.json();
        } catch (error) {
            console.error('Error in saveSettings:', error);
            throw error;
        }
    }

    async sendTestEmail() {
        try {
            const response = await fetch(`${this.apiUrl}/email/test`, {
                method: 'POST'
            });
            if (!response.ok) throw new Error('Failed to send test email');
            return await response.json();
        } catch (error) {
            console.error('Error in sendTestEmail:', error);
            throw error;
        }
    }
}