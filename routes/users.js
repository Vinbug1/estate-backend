const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// require('dotenv').config();
const secret = process.env.SECRET;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *         - PhoneNumber
 *         - status
 *       properties:
 *         fullName:
 *           type: string
 *           description: User's fullName
 *         email:
 *           type: String
 *           description: User's email address
 *         password:
 *           type: boolean
 *           description: User's password for authentication
 *         phone:
 *           type: boolean
 *           description: User's phone number
 *         pin:
 *           type: boolean
 *           description:  User's pin for verification
 *         status:
 *           type: boolean
 *           description: product color
 *       example:
 *         fullName: Solomon
 *         email: solo@gmail.com
 *         password: 12345
 *         phone: 12345678990
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user with verification pin.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/{{SCHEMA_NAME}}'
 *       500:
 *         description: Some server error
 *   post/verify-pin:
 *     summary: Post verify a user pin
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: To verify the user registration.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/{{SCHEMA_NAME}}'
 *       500:
 *         description: Some server error
 *   post/reset-password:
 *     summary: Post to change user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: To change the user password in case the user forgot their password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/{{SCHEMA_NAME}}'
 *       500:
 *         description: Some server error
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/{{SCHEMA_NAME}}'
 *       500:
 *         description: Some server error
 * /users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Single user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/{{SCHEMA_NAME}}'
 *       500:
 *         description: Some server error
 *   put:
 *     summary: Update a single user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Update a single user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/{{SCHEMA_NAME}}'
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: Delete a single user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delete a single user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/{{SCHEMA_NAME}}'
 *       500:
 *         description: Some server error
 * /users/count:
 *   get:
 *     summary: Get the total number of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Get the total number of users.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/{{SCHEMA_NAME}}'
 *       500:
 *         description: Some server error
 */

// Function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, secret, { expiresIn: "1h" });
};

router.post('/register', async (req, res) => {
  try {
    const { fullName, phone, email, password,address,role,occupation } = req.body;

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const user = new User({
      fullName,
      email,
      passwordHash,
      phone,
      address,
      role: "user",
      occupation,
    });
    // generate a random 4-digit PIN
    // const pin = generateRandomPin();
    // const pinExpiry = new Date();
    // pinExpiry.setMinutes(pinExpiry.getMinutes() + 10); // 10 minutes from now
    // sendPinToEmail(email, pin);

    // Save the user to the database
    const savedUser = await user.save();

    if (!savedUser) {
      return res.status(400).send('The user cannot be created!');
    }

    // Respond with the created user
    res.status(200).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate and return JWT token along with user details and image
    const token = generateToken(user._id);

    res.status(200).json({
      token,
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      //role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});




router.get(`/`, async (req, res) => {
  const userList = await User.find().select('-passwordHash');

  if (!userList) {
    res.status(500).json({ success: false })
  }
  res.send(userList);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash');

  if (!user) {
    res.status(500).json({ message: 'The user with the given ID was not found.' })
  }
  res.status(200).send(user);
});

router.put('/:id', async (req, res) => {

  const userExist = await User.findById(req.params.id);
  let newPassword
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10)
  } else {
    newPassword = userExist.passwordHash;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      fullName: req.body.fullName,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phoneNumber: req.body.phoneNumber,
    },
    { new: true }
  )

  if (!user)
    return res.status(400).send('the user cannot be created!')

  res.send(user);
});

router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id).then(user => {
    if (user) {
      return res.status(200).json({ success: true, message: 'the user is deleted!' })
    } else {
      return res.status(404).json({ success: false, message: "user not found!" })
    }
  }).catch(err => {
    return res.status(500).json({ success: false, error: err })
  })
});

router.get(`/count`, async (req, res) => {
  const userCount = await User.countDocuments((count) => count)

  if (!userCount) {
    res.status(500).json({ success: false })
  }
  res.send({
    userCount: userCount
  });
});

// verify authentication pin
router.post("/verify-pin", async (req, res) => {
  try {
    const { email, pin } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists and the PIN is valid
    if (!user || user.pin !== pin || new Date() > user.pinExpiry) {
      return res.status(400).json({ message: "Invalid PIN or expired" });
    }


    res.status(200).json({ message: "PIN verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// Step 1: Initiate password reset request
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'email confirmed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// rest password 
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    user.passwordHash = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

function generateRandomPin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Function to send the pin to the user's email using Nodemailer
function sendPinToEmail(email, pin) {
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // Outlook SMTP server
    port: 587, // Port for sending emails
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your 4-Digit Registration PIN",
    text: `Your registration PIN is: ${pin}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};




module.exports = router;