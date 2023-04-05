const { Appointment } = require("../models/db");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Appointment Schema
function AppointmentData(data) {
	this.id = data._id;
	this.food = data.food;
	this.pickupDateAndTime = data.pickupDateAndTime;
	this.restaurant = data.restaurant;
	this.driver = data.driver;
	this.coordinates = data.coordinates
}

/**
 * Appointment List.
 * 
 * @returns {Object}
 */
exports.AppointmentList = [
	//auth,
	function (req, res) {
		try {
			Appointment.find({}).then((appointment)=>{
				if(appointment.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", appointment);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			console.log(err);
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Appointment Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.AppointmentDetail = [
	//auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Appointment.findOne({_id: req.params.id}).then(function(appointment){                
				if(appointment !== null){
					let appointmentData = new AppointmentData(appointment);
					return apiResponse.successResponseWithData(res, "Operation success", appointmentData);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Appointment store.
 * 
 * @param {string}      food
 * @param {string}		pickupDateAndTime
 * @param {string}		driver
 * @param {string}		restaurant
 * @param {string}		coordinates
 * 
 * @returns {Object}
 */

exports.AppointmentStore = [
	//auth,
	body("food", "food must not be empty."),
	body("pickupDateAndTime", "Pickup Date and Time must not be empty."),
	body("driver", "driver must be a valid ObjectId").isMongoId(),
	body("restaurant", "restaurant must not be empty"),
	body("coordinates", "coordinates must not be empty"),
	//body("otp", "otp must not be empty.").isLength({ min: 1 }).trim(),

	
		//.custom((value,{req}) => {
		// return User.findOne({isbn : value,user: req.user.id}).then(book => {
		// 	if (book) {
		// 		return Promise.reject("Book already exist with this ISBN no.");
		// 	}
		// });
		//}),
	// sanitizeBody("*").escape(), //sanitize for security reasons
	(req, res) => {
		try {
			const errors = validationResult(req);
			console.log(req.body)
			var appointment = new Appointment(
				{ 	food: req.body.food,
					pickupDateAndTime: req.body.pickupDateAndTime,
					driver: req.body.driver,
					restaurant: req.body.restaurant,
					coordinates: req.body.coordinates
				});
			console.log(appointment)
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save appointment
				appointment.save(function (err) {
				  if (err) { return apiResponse.ErrorResponse(res, err); }
				  let appointmentData = new AppointmentData(appointment);
				  return apiResponse.successResponseWithData(res,"Appointment add Success.", appointmentData);
				});	
			  }
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}

];

/**
 * Appointment update.
 * 
 * @param {string}      food 
 * @param {string}      pickupDateAndTime
 * 
 * @returns {Object}
 */

exports.AppointmentUpdate = [
	// auth,
	// input is validated using body method before performing the update //
	body("food", "food must not be empty."),
	body("pickupDateAndTime", "pickupDateAndTime must not be empty."),
	// .custom((value,{req}) => {
	// 	return User.findOne({Name : value,user: req.user.id, id: { "$ne": req.params.id }}).then(book => {
	// 		if (book) {
	// 			return Promise.reject("User already exists with this name.");
	// 		}
	// 	});
	// }),
	// sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid ID.", "Invalid ID");
				}else{
					Appointment.findById(req.params.id, function (err, foundAppointment) {
						if(foundAppointment === null){
							return apiResponse.notFoundResponse(res,"Appointment not exists with this id");
						}else{

							// find appointment by given id and check if the appointment making the request is the one who created the user //							
							
							// update appointment and return success or error message accordingly //
							const updatedFields = {
								food: req.body.food,
								coordinates: req.body.coordinates,
								id: req.body._id,
								pickupDateAndTime: req.body.pickupDateAndTime,
								restaurant: req.body.restaurant,
								driver: req.body.driver,
							};
							Appointment.findByIdAndUpdate(req.params.id, updatedFields, { new: true }, function (err, updatedAppointment) {
								if (err) {
									return apiResponse.ErrorResponse(res, err); 
								} else {
									let appointmentData = new AppointmentData(updatedAppointment);
									return apiResponse.successResponseWithData(res, "Appointment update Success.", appointmentData);
								}
								});
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * User Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.AppointmentDelete = [
	//auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Appointment.findById(req.params.id, function (err, foundAppointment) {
				if(foundAppointment === null){
					return apiResponse.notFoundResponse(res,"Appointment not exists with this id");
				}else{
					//Check authorized appointment
					
						//delete Appointment.
						Appointment.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return apiResponse.ErrorResponse(res, err); 
							}else{
								return apiResponse.successResponse(res,"Appointment delete Success.");
							}
						});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];