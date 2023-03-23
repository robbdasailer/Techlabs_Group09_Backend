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
 * User Detail.
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
			Appointment.findOne({_id: req.params.id}).then(function(user){                
				if(user !== null){
					let appointmentData = new AppointmentData(user);
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
 * User store.
 * 
 * @param {string}      food
 * @param {string}		pickupDateAndTime
 * 
 * @returns {Object}
 */
body()
exports.AppointmentStore = [
	//auth,
	body("food", "food must not be empty.").isLength({ min: 1 }).trim(),
	body("pickupDateAndTime", "Pickup Date and Time must not be empty.").isLength({ min: 1 }).trim(),
	//body("otp", "otp must not be empty.").isLength({ min: 1 }).trim(),

	
		//.custom((value,{req}) => {
		// return User.findOne({isbn : value,user: req.user._id}).then(book => {
		// 	if (book) {
		// 		return Promise.reject("Book already exist with this ISBN no.");
		// 	}
		// });
		//}),
	sanitizeBody("*").escape(), //sanitize for security reasons
	(req, res, next) => {
		try {
			const errors = validationResult(req);
			var appointment = new Appointment(
				{ 	food: req.body.food,
					pickupDateAndTime: req.body.pickupDateAndTime,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save appointment
				appointment.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let appointmentData = new AppointmentData(appointment);
					return apiResponse.successResponseWithData(res,"User add Success.", appointmentData);
				});	
			}
			next()
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	},

];

/**
 * User update.
 * 
 * @param {string}      food 
 * @param {string}      pickupDateAndTime
 * 
 * @returns {Object}
 */

exports.AppointmentUpdate = [
	auth,
	// input is validated using body method before performing the update //
	body("food", "food must not be empty.").isLength({ min: 1 }).trim(),
	body("pickupDateAndTime", "pickupDateAndTime must not be empty.").isLength({ min: 1 }).trim(),
	// .custom((value,{req}) => {
	// 	return User.findOne({Name : value,user: req.user._id, _id: { "$ne": req.params.id }}).then(book => {
	// 		if (book) {
	// 			return Promise.reject("User already exists with this name.");
	// 		}
	// 	});
	// }),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var appointment = new Appointment(
				{ 	food: req.body.food,
					pickupDateAndTime: req.body.pickupDateAndTime,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					Appointment.findById(req.params.id, function (err, foundAppointment) {
						if(foundAppointment === null){
							return apiResponse.notFoundResponse(res,"Appointment not exists with this id");
						}else{
							// find appointment by given id and check if the appointment making the request is the one who created the user //
							if(foundAppointment.appointment.toString() !== req.appointment._id){
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							}else{
								// update appointment and return success or error message accordingly //
								Appointment.findByIdAndUpdate(req.params.id, appointment, {},function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										let appointmentData = new AppointmentData(appointment);
										return apiResponse.successResponseWithData(res,"Appointment update Success.", appointmentData);
									}
								});
							}
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
					if(foundAppointment.appointment.toString() !== req.appointment._id){
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					}else{
						//delete Appointment.
						Appointment.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return apiResponse.ErrorResponse(res, err); 
							}else{
								return apiResponse.successResponse(res,"Appointment delete Success.");
							}
						});
					}
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];