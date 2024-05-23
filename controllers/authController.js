const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User } = require('../models/user');
const secret = process.env.SECRET;

// Register a new user with a role
exports.registerUser = async (req, res) => {
  const {
    fullName,
    email,
    password,
    phone,
    address,
    occupation,
    role
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      address,
      occupation,
      role
    });

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Login a user and create a session
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      token,
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const userList = await User.findAll({ attributes: { exclude: ['password'] } });
    res.send(userList);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
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
exports.updateUserById = async (req, res) => {
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
exports.deleteUserById = async (req, res) => {
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
exports.getUserCount = async (req, res) => {
  try {
    const userCount = await User.count();
    res.send({ userCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Verify authentication pin
exports.verifyPin = async (req, res) => {
  const { email, pin } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || user.pin !== pin || new Date() > user.pinExpiry) {
      return res.status(400).json({ message: 'Invalid PIN or expired' });
    }

    res.status(200).json({ message: 'PIN verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Initiate password reset request
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate and send a PIN to the user's email
    const pin = generateRandomPin();
    user.pin = pin;
    user.pinExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry
    await user.save();
    sendPinToEmail(email, pin);

    res.status(200).json({ message: 'Email confirmed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Generate a random 4-digit PIN
function generateRandomPin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Send the PIN to the user's email using Nodemailer
function sendPinToEmail(email, pin) {
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your 4-Digit Registration PIN',
    text: `Your registration PIN is: ${pin}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, secret, { expiresIn: "1h" });
};




























// using mongoose then uncomment the controller function below:
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const User = require('../models/user');
// const secret = process.env.SECRET;

// // Register a new user with a role
// exports.registerUser = async (req, res) => {
//   const {
//     fullName,
//     email,
//     password,
//     phone,
//     address,
//     occupation,
//     role
//   } = req.body;

//   try {
//     const user = new User({
//       fullName,
//       email,
//       phone,
//       address,
//       occupation,
//       role
//     });

//     await User.register(user, password); // This handles password hashing
//     res.json({ message: 'User registered successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // Login a user and create a session
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.authenticate()(email, password);
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const token = generateToken(user.user._id); // user.user._id is used because of passport-local-mongoose's response structure
    
//     res.status(200).json({
//       token,
//       userId: user.user._id,
//       fullName: user.user.fullName,
//       email: user.user.email,
//       phone: user.user.phone,
//       role: user.user.role,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get all users
// exports.getAllUsers = async (req, res) => {
//   try {
//     const userList = await User.find().select('-hash -salt'); // Exclude hash and salt fields
//     res.send(userList);
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // Get user by ID
// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-hash -salt');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.status(200).send(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Update user by ID
// exports.updateUserById = async (req, res) => {
//   const { fullName, email, password, phone, address, occupation, role } = req.body;

//   try {
//     const userExist = await User.findById(req.params.id);
//     if (!userExist) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const updatedData = {
//       fullName,
//       email,
//       phone,
//       address,
//       occupation,
//       role,
//       passwordHash: password ? bcrypt.hashSync(password, 10) : userExist.passwordHash,
//     };

//     const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true }).select('-hash -salt');
//     res.send(user);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Delete user by ID
// exports.deleteUserById = async (req, res) => {
//   try {
//     const user = await User.findByIdAndRemove(req.params.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found!' });
//     }
//     res.status(200).json({ success: true, message: 'User deleted!' });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // Get user count
// exports.getUserCount = async (req, res) => {
//   try {
//     const userCount = await User.countDocuments();
//     res.send({ userCount });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // Verify authentication pin
// exports.verifyPin = async (req, res) => {
//   const { email, pin } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user || user.pin !== pin || new Date() > user.pinExpiry) {
//       return res.status(400).json({ message: 'Invalid PIN or expired' });
//     }

//     res.status(200).json({ message: 'PIN verified successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// };

// // Initiate password reset request
// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Generate and send a PIN to the user's email
//     const pin = generateRandomPin();
//     user.pin = pin;
//     user.pinExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry
//     await user.save();
//     sendPinToEmail(email, pin);

//     res.status(200).json({ message: 'Email confirmed successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// };

// // Reset password
// exports.resetPassword = async (req, res) => {
//   const { email, newPassword } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Hash the new password
//     user.setPassword(newPassword, async (err) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//       } else {
//         await user.save();
//         res.status(200).json({ message: 'Password reset successful' });
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// };

// // Generate a random 4-digit PIN
// function generateRandomPin() {
//   return Math.floor(1000 + Math.random() * 9000).toString();
// }

// // Send the PIN to the user's email using Nodemailer
// function sendPinToEmail(email, pin) {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp-mail.outlook.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Your 4-Digit Registration PIN',
//     text: `Your registration PIN is: ${pin}`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error('Error sending email:', error);
//     } else {
//       console.log('Email sent:', info.response);
//     }
//   });
// }

// // Function to generate JWT token
// const generateToken = (userId) => {
//   return jwt.sign({ userId }, secret, { expiresIn: "1h" });
// };

