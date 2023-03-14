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
 *         enum: ['DRIVER','RESTAURANT']
 *       password:
 *         type: string
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
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