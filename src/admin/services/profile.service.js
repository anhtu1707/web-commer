export class ProfileService {
    constructor() {
        this.apiUrl = '/api/admin/profile';
    }

    async getProfile() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('Failed to fetch profile');
            return await response.json();
        } catch (error) {
            console.error('Error in getProfile:', error);
            throw error;
        }
    }

    async updateProfile(profileData) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });
            if (!response.ok) throw new Error('Failed to update profile');
            return await response.json();
        } catch (error) {
            console.error('Error in updateProfile:', error);
            throw error;
        }
    }

    async uploadAvatar(file) {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch(`${this.apiUrl}/avatar`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Failed to upload avatar');
            return await response.json();
        } catch (error) {
            console.error('Error in uploadAvatar:', error);
            throw error;
        }
    }

    async changePassword(passwordData) {
        try {
            const response = await fetch(`${this.apiUrl}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(passwordData)
            });
            if (!response.ok) throw new Error('Failed to change password');
            return await response.json();
        } catch (error) {
            console.error('Error in changePassword:', error);
            throw error;
        }
    }

    async getActivities() {
        try {
            const response = await fetch(`${this.apiUrl}/activities`);
            if (!response.ok) throw new Error('Failed to fetch activities');
            return await response.json();
        } catch (error) {
            console.error('Error in getActivities:', error);
            throw error;
        }
    }
}