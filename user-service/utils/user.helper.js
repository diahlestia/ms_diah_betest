import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Hash the password before saving it.
 * @param {string} password - Password to hash.
 * @returns {Promise<string>} - The hashed password.
 */
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

/**
 * Validate a user's password.
 * @param {string} userInputPassword - The password input from the user.
 * @param {string} storedPassword - The hashed password stored in the database.
 * @returns {Promise<boolean>} - True if the passwords match, otherwise false.
 */
export const validatePassword = async (userInputPassword, storedPassword) => {
    return await bcrypt.compare(userInputPassword, storedPassword);
};

/**
 * Generate a JWT token.
 * @param {string} userId - The ID of the user to include in the token.
 * @returns {string} - The generated JWT token.
 */
export const generateJwtToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: +(process.env.JWT_EXPIRE),
    });
};
