const jwt = require('jsonwebtoken');
const { Role } = require('../models');

const verifyToken = (req, res, next) => {
  // Get token from headers
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user information to request object
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(403).json({ message: 'Token is not valid' });
  }
};

const checkPermission = (permission) => {
  return async (req, res, next) => {
    const userRole = req.user.role; // assuming req.user is set after verifying token

    const role = await Role.findOne({ where: { name: userRole } });

    if (!role || !role.permissions.includes(permission)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkPermission,
};
