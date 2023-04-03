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


router.get("/:id", RestaurantController.RestaurantDetail);


router.post("/", RestaurantController.RestaurantStore);


router.put("/:id", RestaurantController.RestaurantUpdate);


router.delete("/:id", RestaurantController.RestaurantDelete);

module.exports = router;