import jwt from 'jsonwebtoken';
import User from '../model/User.js';

export const protect = async (req, res, next) => {
    const token = req.cookies?.token;
    
    if (!token) {
        res.status(401).json({ message: 'Not authorized' });
    }
    else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (!user) {
                res.status(401).json({ message: 'User not found' });
            }
            else
            {
                req.user = user;
                next();
            }
        } catch (error) {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    }
};
