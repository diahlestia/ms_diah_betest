import Log from '../models/log.model.js';

export const createLog = async (operation, userId) => {
    try {
        await Log.create({
            operation,
            userId,
        });
        return true;
    } catch (error) {
        console.error("Error creating log:", error.message);
    }
};
