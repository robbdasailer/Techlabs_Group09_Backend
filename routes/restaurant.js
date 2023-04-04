var express = require("express");
const RestaurantController = require("../controllers/RestaurantController");

var router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the restaurant
 *         name:
 *           type: string
 *           description: The name of the restaurant
 *         coordinates:
 *           type: array
 *           items:
 *             type: number
 *           description: The coordinates of the restaurant location
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *               description: The street of the restaurant location
 *             number:
 *               type: number
 *               description: The street number of the restaurant location
 *             city:
 *               type: string
 *               description: The city of the restaurant location
 *             postalCode:
 *               type: number
 *               description: The postal code of the restaurant location
 *           required:
 *             - street
 *             - number
 *             - city
 *             - postalCode
 *         contactInformation:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *               description: The phone number of the restaurant
 *             email:
 *               type: string
 *               description: The email address of the restaurant
 *           required:
 *             - phone
 *             - email
 *         picture:
 *           type: string
 *           description: The URL for the picture of the restaurant
 *         employees:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: The IDs of the employees who work at the restaurant
 *       required:
 *         - _id
 *         - name
 *         - coordinates
 *         - address
 *         - contactInformation
 */

/**
 * @openapi
 * /api/restaurant:
 *   get:
 *     summary: Retrieve a list of restaurants
 *     tags: [Restaurants]
 *     description: Retrieve a list of all restaurants from the database
 *     responses:
 *       200:
 *         description: A list of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 */
router.get("/", RestaurantController.RestaurantList);

/**
 * @openapi
 * /api/restaurants/{id}:
 *   get:
 *     summary: Retrieve a single restaurant by ID
 *     tags: [Restaurants]
 *     description: Retrieve a restaurant by its ID from the database
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the restaurant to retrieve
 *         schema:
 *           type: string
 *         required: true
 *         example: 1234567890abcdefg
 *     responses:
 *       200:
 *         description: A single restaurant object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: The restaurant with the specified ID was not found
 */
router.get("/:id", RestaurantController.RestaurantDetail);

/**
 * @openapi
 * /api/restaurant/:
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
 *     description: Create a new restaurant in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewRestaurant'
 *     responses:
 *       201:
 *         description: The created restaurant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/", RestaurantController.RestaurantStore);

/**
 * @openapi
 * /api/restaurant/{id}:
 *   put:
 *     summary: Update a restaurant by ID
 *     tags: [Restaurants]
 *     description: Update a restaurant by providing the ID and new restaurant data
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the restaurant to update
 *     requestBody:
 *       description: New restaurant data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRestaurant'
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Invalid restaurant data provided
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", RestaurantController.RestaurantUpdate);

/**
 * @openapi
 * /api/restaurant/{id}:
 *   delete:
 *     summary: Delete a restaurant
 *     tags: [Restaurants]
 *     description: Delete a restaurant from the database by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the restaurant to delete.
 *     responses:
 *       204:
 *         description: Restaurant successfully deleted.
 *       404:
 *         description: Restaurant not found.
 *       500:
 *         description: Server error.
 */
router.delete("/:id", RestaurantController.RestaurantDelete);

module.exports = router;