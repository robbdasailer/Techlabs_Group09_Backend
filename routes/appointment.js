var express = require("express");
const AppointmentController = require("../controllers/AppointmentController");

var router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     FoodItem:
 *       type: object
 *       properties:
 *         name:
 *          type: string
 *          description: The name of the food item.
 *          example: Pizza
 *         unit:
 *          type: string
 *          enum: [KG, LITER, PIECE, BOX]
 *          description: The unit of measurement for the quantity.
 *          example: PIECE
 *         quantity:
 *          type: number
 *          description: The quantity of the food item.
 *          example: 2
 *       required:
 *         - name
 *         - unit
 *         - quantity
 *     
 *     Driver:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the driver
 *         firstName:
 *           type: string
 *           description: The driver's first name
 *         lastName:
 *           type: string
 *           description: The driver's last name
 *         email:
 *           type: string
 *           description: The driver's email address
 *         type:
 *           type: string
 *           description: The driver's type (e.g. 'DRIVER', 'EMPLOYEE')
 *       required:
 *         - _id
 *         - firstName
 *         - lastName
 *         - email
 *         - type
 *          
 *     Appointment:
 *       type: object
 *       properties:
 *         food:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FoodItem'
 *           description: The food items for the appointment.
 *         pickupDateAndTime:
 *           type: string
 *           format: date-time
 *           description: The pickup date and time for the appointment.
 *         driver:
 *           type: string
 *           format: uuid
 *           description: The ID of the driver for the appointment.
 *         restaurant:
 *           type: string
 *           format: uuid
 *           description: The ID of the restaurant for the appointment.
 *         coordinates:
 *           type: array
 *           items:
 *             type: number
 *           description: The coordinates of the appointment location.
 *       required:
 *         - food
 *         - pickupDateAndTime
 *         - restaurant
 *         - coordinates
 * 
 *     UpdateAppointment:
 *       type: object
 *       properties:
 *         food:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FoodItem'
 *         pickupDateAndTime:
 *           type: string
 *           format: date-time
 *         driver:
 *           type: string
 *           format: uuid
 *         restaurant:
 *           type: string
 *           format: uuid
 *         coordinates:
 *           type: array
 *           items:
 *             type: number
 *             format: float
 *       required:
 *         - food
 *         - pickupDateAndTime
 *         - restaurant
 *         - coordinates 
 *  
 *     NewAppointment:
 *       type: object
 *       properties:
 *         food:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FoodItem'
 *           required: true
 *         pickupDateAndTime:
 *           type: string
 *           format: date-time
 *           required: true
 *         driver:
 *           type: string
 *           format: uuid
 *         restaurant:
 *           type: string
 *           format: uuid
 *           required: true
 *         coordinates:
 *           type: array
 *           items:
 *             type: number
 *           required: true
 *       required:
 *         - food
 *         - pickupDateAndTime
 *         - restaurant
 *         - coordinates
 */

/**
 * @openapi
 * /api/appointment/:
 *   get:
 *     summary: Retrieve a list of appointments
 *     tags: [Appointments]
 *     description: Retrieve a list of all appointments from the database
 *     responses:
 *       200:
 *         description: A list of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */
router.get("/", AppointmentController.AppointmentList);

/**
 * @openapi
 * /api/appointment/{id}:
 *   get:
 *     summary: Get an appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the appointment to retrieve
 *     responses:
 *       200:
 *         description: The appointment with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 */
router.get("/:id", AppointmentController.AppointmentDetail);

/**
 * @openapi
 * /api/appointment/:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       description: add a new appointment
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewAppointment'
 *     responses:
 *       201:
 *         description: The created appointment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 */
router.post("/", AppointmentController.AppointmentStore);

/**
 * @openapi
 * /api/appointment/:
 *   put:
 *     summary: Update an appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the appointment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAppointment'
 *     responses:
 *       200:
 *         description: The updated appointment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 */
router.put("/:id", AppointmentController.AppointmentUpdate);

/**
 * @openapi
 * /api/appointment/:
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the appointment to delete
 *     responses:
 *       204:
 *         description: Appointment deleted
 *       404:
 *         description: Appointment not found
 */
router.delete("/:id", AppointmentController.AppointmentDelete);

module.exports = router;