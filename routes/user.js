var express = require("express");
const UserController = require("../controllers/UserController");

var router = express.Router();

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:            # arbitrary name for the security scheme
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT 
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
 * /api/user/:
 *   get:
 *     tags: [Users]
 *     summary: get all users 
 *     responses:
 *       200:
 *         description: a list of users
 *         content: 
 *           application/json: 
 *             schema:
 *               type: array
 *               items: 
 *                 $ref: '#/definitions/User'
 *  
 */
router.get("/", UserController.UserList); //should not provide OTP and password !

/**
 * @openapi
 * /api/user/{id}:
 *   get:
 *     security:
 *       - bearerAuth: [] 
 *     tags: [Users]
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to get
 *     responses:
 *       200:
 *         description: The user with the specified ID
 *         content: 
 *           application/json: 
 *             schema:
 *               $ref: '#/definitions/User'
 */
router.get("/:id", UserController.UserDetail); //should not provide OTP and password !

/**
 * @openapi
 * /api/user/:
 *   post:
 *     tags: [Users]
 *     summary: This adds a new user 
 *     requestBody:
 *       description: add a new user
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
router.post("/", UserController.UserStore);

/**
 * @openapi
 * /api/user/{id}:
 *   put:
 *     security:
 *       - bearerAuth: [] 
 *     tags: [Users]
 *     summary: This updates a user
 *     requestBody:
 *       description: update a user
 *       required: true
 *       content: 
 *         application/json: 
 *           schema:
 *               type: object
 *               required:
 *                 - firstName
 *                 - lastName
 *               properties:
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.put("/:id", UserController.UserUpdate);


/**
 * @openapi
 * /api/user/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: [] 
 *     tags: [Users]
 *     summary: This deletes a user 
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to delete
 *         
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.delete("/:id", UserController.UserDelete);

module.exports = router;