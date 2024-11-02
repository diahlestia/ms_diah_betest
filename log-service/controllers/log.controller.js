import { saveLogData } from '../services/log.service.js';

export const createLog = async (operation, userId) => {
    try {
        await saveLogData({
            operation,
            userId,
        });
        return true;
    } catch (error) {
        console.error("Error creating log:", error.message);
    }
};
