const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const { User } = require('../models');

const secret = process.env.JWT_SECRET;

// Function to handle registration
const register = async (req, res) => {
  // Validate user input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password, phone, address, occupation, role } = req.body;

  try {
    // Check if user with email exists
    let user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      address,
      occupation,
      role,
    });

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Function to handle user login
const login = async (req, res) => {
  // Validate user input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Create JWT token
    const token = generateToken(user.id);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Function to verify JWT token
const verifyToken = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, secret);

    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Initiate password reset request
const forgotPassword = async (req, res) => {
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

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const { email, newPassword, pin } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || user.pin !== pin || new Date() > user.pinExpiry) {
      return res.status(400).json({ message: 'Invalid or expired PIN' });
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.pin = null; // Clear PIN after reset
    user.pinExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Generate a random 4-digit PIN
const generateRandomPin = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Send the PIN to the user's email using Nodemailer
const sendPinToEmail = (email, pin) => {
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
    subject: 'Password Reset PIN',
    text: `Your password reset PIN is: ${pin}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, secret, { expiresIn: '1h' });
};

module.exports = {
  register,
  login,
  verifyToken,
  forgotPassword,
  resetPassword,
};
