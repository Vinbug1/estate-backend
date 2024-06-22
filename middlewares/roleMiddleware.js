const { User, Role, Permission } = require('../models');

// Middleware to check if user has a specific role
const checkUserRole = async (req, res, next) => {
  const userId = req.user.id; // Assuming user object is attached by authentication middleware

  try {
    // Find user in database
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          attributes: ['name'],
          through: { attributes: [] }, // Exclude pivot table attributes
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has the required role
    const roles = user.Roles.map(role => role.name); // Extract role names

    if (!roles.includes('admin')) { // Change admin to whatever your required role is
      return res.status(403).json({ message: 'Unauthorized - Requires admin role' });
    }

    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Middleware to check if user has a specific permission
const checkPermission = (permission) => async (req, res, next) => {
  const userId = req.user.id; // Assuming user object is attached by authentication middleware

  try {
    // Find user in database
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          attributes: [],
          include: [
            {
              model: Permission,
              attributes: [],
              where: { name: permission },
            },
          ],
          through: { attributes: [] }, // Exclude pivot table attributes
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has the required permission
    const roles = user.Roles;

    if (roles.length === 0) {
      return res.status(403).json({ message: 'Unauthorized - Insufficient permissions' });
    }

    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  checkUserRole,
  checkPermission,
};
