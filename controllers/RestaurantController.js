const { Restaurant } = require("../models/db");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Restaurant Schema
function RestaurantData(data) {
	this.id = data._id;
	this.name = data.name;
	this.location = data.location;
	this.address = data.address;
	this.contactInformation = data.contactInformation;
	this.picture = data.picture;
}

/**
 * Restaurant List.
 * 
 * @returns {Object}
 */
exports.RestaurantList = [
	auth,
	function (req, res) {
		try {
			Restaurant.find({}).then((restaurant)=>{
				if(restaurant.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", restaurant);
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
 * Restaurant Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.RestaurantDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Restaurant.findOne({_id: req.params.id}).then(function(restaurant){                
				if(restaurant !== null){
					let restaurantData = new RestaurantData(restaurant);
					return apiResponse.successResponseWithData(res, "Operation success", restaurantData);
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
 * Restaurant store.
 * 
 * @param {string}      lastName 
 * @param {string}		firstName
 * @param {string}      email
 * @param {string}      password
 * 
 * @returns {Object}
 */
body()
exports.RestaurantStore = [
	auth,
	body("name", "Name must not be empty.").isLength({ min: 1 }).trim(),
	body("coordinates", "coordinates must not be empty."),
	body("address", "address must not be empty."),
	body("contactInformation", "contactInformation must fulfill conditions"),
	
		//.custom((value,{req}) => {
		// return User.findOne({isbn : value,user: req.user._id}).then(book => {
		// 	if (book) {
		// 		return Promise.reject("Book already exist with this ISBN no.");
		// 	}
		// });
		//}),
	//sanitizeBody("*").escape(), //sanitize for security reasons
	(req, res, next) => {
		try {
			const errors = validationResult(req);
			var restaurant = new Restaurant(
				{ 	name: req.body.name,
					coordinates: req.body.coordinates,
					address: req.body.address,
					contactInformation: req.body.contactInformation,
					picture: req.body.picture, 
				});

			if (!errors.isEmpty()) {

				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save restaurant
				restaurant.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let restaurantData = new RestaurantData(restaurant);
					return apiResponse.successResponseWithData(res,"Restaurant add Success.", restaurantData);
				});	
			}
			
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	},
];

/**
 * Restaurant update.
 * 
 * @param {string}      Name 
 * @param {string}      email
 * @param {string}      password
 * 
 * @returns {Object}
 */

exports.RestaurantUpdate = [
	auth,
	// input is validated using body method before performing the update //
	body("name", "Name must not be empty.").isLength({ min: 1 }).trim(),
	body("coordinates", "coordinates must not be empty.").isLength({ min: 1 }).trim(),
	body("address", "address must not be empty.").isLength({ min: 1 }).trim(),
	body("contactInformation", "contactInformation must fulfill conditions").isLength({ min: 5, max: 20 }).trim(),
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
			var restaurant = new Restaurant(
				{ 	name: req.body.name,
					coordinates: req.body.coordinates,
					address: req.body.address,
					contactInformation: req.body.contactInformation,
					picture: req.body.picture, 
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					Restaurant.findById(req.params.id, function (err, foundRestaurant) {
						if(foundRestaurant === null){
							return apiResponse.notFoundResponse(res,"Restaurant not exists with this id");
						}else{
							// find restaurant by given id and check if the restaurant making the request is the one who created the restaurant //
							if(foundRestaurant.restaurant.toString() !== req.restaurant._id){
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							}else{
								// update restaurant and return success or error message accordingly //
								Restaurant.findByIdAndUpdate(req.params.id, book, {},function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										let RestaurantData = new RestaurantData(book);
										return apiResponse.successResponseWithData(res,"Restaurant update Success.", RestaurantData);
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
 * Restaurant Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.RestaurantDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Restaurant.findById(req.params.id, function (err, foundRestaurant) {
				if(foundRestaurant === null){
					return apiResponse.notFoundResponse(res,"Restaurant not exists with this id");
				}else{
					//Check authorized restaurant
					if(foundRestaurant.restaurant.toString() !== req.restaurant._id){
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					}else{
						//delete Restaurant.
						Restaurant.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return apiResponse.ErrorResponse(res, err); 
							}else{
								return apiResponse.successResponse(res,"Restaurant delete Success.");
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