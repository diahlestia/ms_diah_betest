import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided, authorization denied.',
                data: null,
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found, authorization denied.',
                data: null,
            });
        }

        next();
    } catch (error) {
        console.error('Authorization error:', error);
        return res.status(401).json({
            success: false,
            message: 'Token is invalid or expired, authorization denied.',
        });
    }
};

export default auth;
