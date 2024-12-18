import { UserModel } from '../models/user.model';
import { constants } from '../config/constants';
import bcrypt from 'bcrypt';

export class UserRepository {
    static async getUsers(options = {}) {
        try {
            const users = await UserModel.findAll(options);
            return users.map(user => this.sanitizeUser(user));
        } catch (error) {
            console.error('Error getting users:', error);
            throw error;
        }
    }

    static async getUserById(id) {
        try {
            const user = await UserModel.findById(id);
            if (!user) {
                throw new Error('User not found');
            }
            return this.sanitizeUser(user);
        } catch (error) {
            console.error('Error getting user:', error);
            throw error;
        }
    }

    static async createUser(data) {
        try {
            // Check if email exists
            const existingUser = await UserModel.findByEmail(data.email);
            if (existingUser) {
                throw new Error('Email already exists');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(data.password, 10);

            const userId = await UserModel.create({
                ...data,
                password: hashedPassword,
                status: constants.USER_STATUS.ACTIVE,
                created_at: new Date()
            });

            return await this.getUserById(userId);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    static async updateUser(id, data) {
        try {
            if (data.email) {
                const existingUser = await UserModel.findByEmail(data.email);
                if (existingUser && existingUser.id !== id) {
                    throw new Error('Email already exists');
                }
            }

            await UserModel.update(id, {
                ...data,
                updated_at: new Date()
            });

            return await this.getUserById(id);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    static async deleteUser(id) {
        try {
            await UserModel.delete(id);
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    static async changePassword(id, currentPassword, newPassword) {
        try {
            const user = await UserModel.findById(id);
            if (!user) {
                throw new Error('User not found');
            }

            // Verify current password
            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) {
                throw new Error('Current password is incorrect');
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await UserModel.changePassword(id, hashedPassword);

            return true;
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }

    static sanitizeUser(user) {
        if (!user) return null;
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }
}