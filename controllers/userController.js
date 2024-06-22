const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');
const { checkPermission } = require('../middlewares/authMiddleware');

// Get all users
const getAllUser = async (req, res) => {
  try {
    const userList = await User.findAll({ attributes: { exclude: ['password'] } });
    res.send(userList);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user by ID
const updateUserById = async (req, res) => {
  const { fullName, email, password, phone, address, occupation, role } = req.body;

  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedData = {
      fullName,
      email,
      phone,
      address,
      occupation,
      role,
    };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updatedData);

    const updatedUser = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    res.send(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete user by ID
const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

    await user.destroy();
    res.status(200).json({ success: true, message: 'User deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get user count
const getUserCount = async (req, res) => {
  try {
    const userCount = await User.count();
    res.send({ userCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAllUser: [checkPermission('read_user'), getAllUser],
  getUserById: [checkPermission('read_user'), getUserById],
  updateUserById: [checkPermission('update_user'), updateUserById],
  deleteUserById: [checkPermission('delete_user'), deleteUserById],
  getUserCount: [checkPermission('count_user'), getUserCount],
};
