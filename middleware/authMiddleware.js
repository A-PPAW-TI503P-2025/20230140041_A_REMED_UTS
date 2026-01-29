const authMiddleware = (requiredRole) => {
    return (req, res, next) => {
        const userRole = req.headers['x-user-role'];

        if (!userRole) {
            return res.status(401).json({ message: 'No role provided in headers' });
        }

        if (userRole === 'admin') {
            
            return next();
        }

        if (requiredRole && userRole !== requiredRole) {
            return res.status(403).json({ message: `Access denied. Requires ${requiredRole} role.` });
        }

        next();
    };
};

module.exports = authMiddleware;