const express = require('express');
const router = express.Router();
const rbacMiddleware = require('../middleware/rbacMiddleware');
const authController = require('../controllers/authController');

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
 *         - phone
 *         - status
 *       properties:
 *         fullName:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           description: User's email address
 *         password:
 *           type: string
 *           description: User's password for authentication
 *         phone:
 *           type: string
 *           description: User's phone number
 *         pin:
 *           type: string
 *           description: User's pin for verification
 *         status:
 *           type: boolean
 *           description: User's status
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
 */

/**
 * @swagger
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
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
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
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /users/{id}:
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
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /users/{id}:
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
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
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
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /users/verify-pin:
 *   post:
 *     summary: Verify a user pin
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
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Change user password
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
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: To reset the user password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

router.post('/users', authController.registerUser);
router.get('/users', rbacMiddleware.checkPermission('read_user'), authController.getAllUsers);
router.get('/users/:id', authController.getUserById);
router.put('/users/:id', rbacMiddleware.checkPermission('update_user'), authController.updateUserById);
router.delete('/users/:id', rbacMiddleware.checkPermission('delete_user'), authController.deleteUserById);
router.get('/users/count', rbacMiddleware.checkPermission('count_user'), authController.getUserCount);
router.post('/users/verify-pin', rbacMiddleware.checkPermission('count_users_pin'), authController.verifyPin);
router.post('/users/forgot-password', rbacMiddleware.checkPermission('forgot_user_password'), authController.forgotPassword);
router.post('/users/reset-password', rbacMiddleware.checkPermission('reset_user_password'), authController.resetPassword);

module.exports = router;















// using mongoose the uncomment the code below: 
// const express = require('express');
// const router = express.Router();
// const rbacMiddleware = require('../middleware/rbacMiddleware');
// const authController = require('../controllers/authController');

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     User:
//  *       type: object
//  *       required:
//  *         - fullName
//  *         - email
//  *         - password
//  *         - phone
//  *         - status
//  *       properties:
//  *         fullName:
//  *           type: string
//  *           description: User's full name
//  *         email:
//  *           type: string
//  *           description: User's email address
//  *         password:
//  *           type: string
//  *           description: User's password for authentication
//  *         phone:
//  *           type: string
//  *           description: User's phone number
//  *         pin:
//  *           type: string
//  *           description: User's pin for verification
//  *         status:
//  *           type: boolean
//  *           description: User's status
//  *       example:
//  *         fullName: Solomon
//  *         email: solo@gmail.com
//  *         password: 12345
//  *         phone: 12345678990
//  */

// /**
//  * @swagger
//  * tags:
//  *   name: Users
//  *   description: API for managing users
//  */

// /**
//  * @swagger
//  * /users:
//  *   post:
//  *     summary: Create a new user
//  *     tags: [Users]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/User'
//  *     responses:
//  *       200:
//  *         description: The created user with verification pin.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/User'
//  *       500:
//  *         description: Some server error
//  */

// /**
//  * @swagger
//  * /users:
//  *   get:
//  *     summary: Get all users
//  *     tags: [Users]
//  *     responses:
//  *       200:
//  *         description: List of users.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/User'
//  *       500:
//  *         description: Some server error
//  */

// /**
//  * @swagger
//  * /users/{id}:
//  *   get:
//  *     summary: Get a single user by ID
//  *     tags: [Users]
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: The user ID
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Single user.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/User'
//  *       500:
//  *         description: Some server error
//  */

// /**
//  * @swagger
//  * /users/{id}:
//  *   put:
//  *     summary: Update a single user by ID
//  *     tags: [Users]
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: The user ID
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/User'
//  *     responses:
//  *       200:
//  *         description: Update a single user.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/User'
//  *       500:
//  *         description: Some server error
//  */

// /**
//  * @swagger
//  * /users/{id}:
//  *   delete:
//  *     summary: Delete a single user by ID
//  *     tags: [Users]
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: The user ID
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Delete a single user.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/User'
//  *       500:
//  *         description: Some server error
//  */

// /**
//  * @swagger
//  * /users/count:
//  *   get:
//  *     summary: Get the total number of users
//  *     tags: [Users]
//  *     responses:
//  *       200:
//  *         description: Get the total number of users.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/User'
//  *       500:
//  *         description: Some server error
//  */

// /**
//  * @swagger
//  * /users/verify-pin:
//  *   post:
//  *     summary: Verify a user pin
//  *     tags: [Users]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/User'
//  *     responses:
//  *       200:
//  *         description: To verify the user registration.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/User'
//  *       500:
//  *         description: Some server error
//  */

// /**
//  * @swagger
//  * /users/forgot-password:
//  *   post:
//  *     summary: Change user password
//  *     tags: [Users]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/User'
//  *     responses:
//  *       200:
//  *         description: To change the user password in case the user forgot their password.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/User'
//  *       500:
//  *         description: Some server error
//  */

// /**
//  * @swagger
//  * /users/reset-password:
//  *   post:
//  *     summary: Reset user password
//  *     tags: [Users]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/User'
//  *     responses:
//  *       200:
//  *         description: To reset the user password.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/User'
//  *       500:
//  *         description: Some server error
//  */

// router.post('/users', authController.registerUser);
// router.get('/users', rbacMiddleware.checkPermission('read_user'), authController.getAllUsers);
// router.get('/users/:id', authController.getUserById);
// router.put('/users/:id', rbacMiddleware.checkPermission('update_user'), authController.updateUserById);
// router.delete('/users/:id', rbacMiddleware.checkPermission('delete_user'), authController.deleteUserById);
// router.get('/users/count', rbacMiddleware.checkPermission('count_user'), authController.getUserCount);
// router.post('/users/verify-pin', rbacMiddleware.checkPermission('count_users_pin'), authController.verifyPin);
// router.post('/users/forgot-password', rbacMiddleware.checkPermission('forgot_user_password'), authController.forgotPassword);
// router.post('/users/reset-password', rbacMiddleware.checkPermission('reset_user_password'), authController.resetPassword);

// module.exports = router;
