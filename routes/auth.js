var express = require("express");
const AuthController = require("../controllers/AuthController");

var router = express.Router();

/**
 * @openapi
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - email
 *       - firstName
 *       - lastName
 *       - type
 *       - password
 *     properties:
 *       email:
 *         type: string
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       type:
 *         type: string
 *         enum: ['DRIVER','EMPLOYEE']
 *       password:
 *         type: string
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: This registers a user 
 *     requestBody:
 *       description: registration
 *       required: true
 *       content: 
 *         application/json: 
 *           schema:
 *             $ref: '#/definitions/User'
 *         
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.post("/register", AuthController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: This logs a user in
 *     requestBody:
 *       description: login
 *       required: true
 *       content: 
 *         application/json: 
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *         
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.post("/login", AuthController.login);
router.post("/verify-otp", AuthController.verifyConfirm);
router.post("/resend-verify-otp", AuthController.resendConfirmOtp);

module.exports = router;


// // ChatGPT Code

// var express = require("express");
// const AuthController = require("../controllers/AuthController");

// var router = express.Router();

// /**
//  * @openapi
//  * components:
//  *   schemas:
//  *     User:
//  *       type: object
//  *       properties:
//  *         email:
//  *           type: string
//  *         firstName:
//  *           type: string
//  *         lastName:
//  *           type: string
//  *         type:
//  *           type: string
//  *           enum: ['DRIVER', 'EMPLOYEE']
//  *         password:
//  *           type: string
//  *       required:
//  *         - email
//  *         - firstName
//  *         - lastName
//  *         - type
//  *         - password
//  */

// /**
//  * @openapi
//  * /auth/register:
//  *   post:
//  *     summary: Register a new user 
//  *     requestBody:
//  *       description: User registration
//  *       required: true
//  *       content: 
//  *         application/json: 
//  *           schema:
//  *             $ref: '#/components/schemas/User'
//  *         
//  *     responses:
//  *       200:
//  *         description: User registration successful
//  */
// router.post("/register", AuthController.register);

// /**
//  * @openapi
//  * /auth/login:
//  *   post:
//  *     summary: Login with email and password
//  *     requestBody:
//  *       description: User login
//  *       required: true
//  *       content: 
//  *         application/json: 
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *             required:
//  *               - email
//  *               - password
//  *         
//  *     responses:
//  *       200:
//  *         description: User logged in successfully
//  */
// router.post("/login", AuthController.login);

// /**
//  * @openapi
//  * /auth/verify-otp:
//  *   post:
//  *     summary: Verify a user's OTP
//  *     requestBody:
//  *       description: OTP verification
//  *       required: true
//  *       content: 
//  *         application/json: 
//  *           schema:
//  *             type: object
//  *             properties:
//  *               otp:
//  *                 type: string
//  *             required:
//  *               - otp
//  *         
//  *     responses:
//  *       200:
//  *         description: OTP verification successful
//  */
// router.post("/verify-otp", AuthController.verifyConfirm);

// /**
//  * @openapi
//  * /auth/resend-verify-otp:
//  *   post:
//  *     summary: Resend OTP for user verification
//  *     requestBody:
//  *       description: OTP resend
//  *       required: true
//  *       content: 
//  *         application/json: 
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *             required:
//  *               - email
//  *         
//  *     responses:
//  *       200:
//  *         description: OTP resent successfully
//  */
// router.post("/resend-verify-otp", AuthController.resendConfirmOtp);

// module.exports = router;
