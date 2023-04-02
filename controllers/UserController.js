const { User } = require("../models/db");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// User Schema that is forwarded to front-end
function UserData(data) {
	this.id = data._id;
	this.lastName = data.lastName;
	this.firstName = data.firstName;
	this.email = data.email;
	this.isConfirmed = data.isConfirmed;
	this.status = data.status;
}

/**
 * User List.
 * 
 * @returns {Object}
 */
exports.UserList = [
	//auth,
	function (req, res) {
		try {
			User.find({}).then((users)=>{
				if(users.length > 0){
					//console.log(users)
					return apiResponse.successResponseWithData(res, "Operation success", users);//.map(x => UserData(x)));
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
exports.UserDetail = [
	//auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			User.findOne({_id: req.params.id}).then(function(user){                
				if(user !== null){
					let userData = new UserData(user);
					return apiResponse.successResponseWithData(res, "Operation success", userData);
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
 * @param {string}      lastName 
 * @param {string}		firstName
 * @param {string}      email
 * @param {string}      type
 * @param {string}      password
 */
body()
exports.UserStore = [
    body("lastName", "Last name must not be empty.").isLength({ min: 1 }).trim(),
    body("firstName", "First name must not be empty.").isLength({ min: 1 }).trim(),
    body("email", "E-mail must not be empty.").isLength({ min: 1 }).trim(),
    body("type", "Type must not be empty.").isLength({ min: 1 }).trim(),
    body("password", "Password must fulfill conditions.").isLength({ min: 5, max: 20 }).trim(),
    //body("confirmOTP"), // assuming that this parameter is optional
    // body("email").custom((value, { req }) => {
    //     return User.findOne({ email: value, user: req.user.email }).then((user) => {
    //         if (user) {
    //             return Promise.reject("User already exists with this e-mail.");
    //         }
    //     });
    // }),

// exports.UserStore = [
// 	//auth,
// 	body("lastName", "Name must not be empty.").isLength({ min: 1 }).trim(),
// 	body("firstName", "Name must not be empty.").isLength({ min: 1 }).trim(),
// 	body("email", "e-mail must not be empty.").isLength({ min: 1 }).trim(),
// 	body("type"),
// 	body("password", "password must fulfill conditions").isLength({ min: 5, max: 20 }).trim(),
// 	body("confirmOTP"),//, "otp must not be empty.").isLength({ min: 1 }).trim(),

// 		.custom((value,{req}) => {
// 		return User.findOne({id : value,user: req.user.id}).then(user => {
// 			if (user) {
// 				return Promise.reject("User already exists with this e-mail.");
// 			}
// 		});
// 		}),
	sanitizeBody("*").escape(), //sanitize for security reasons
	(req, res, next) => {
		try {
			const errors = validationResult(req);
			var user = new User(
				{ 	lastName: req.body.lastName,
					firstName: req.body.firstName,
					email: req.body.email,
					password: req.body.password,
					type: req.body.type,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save user
				user.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let userData = new UserData(user);
					return apiResponse.successResponseWithData(res,"User add Success.", userData);
				});	
			}
			next()
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	},
	(req, res)=> {
		console.log('Hi there')
	}

];

/**
 * User update.
 * 
 * @param {string}      firstName 
 * @param {string}      lastName 
 * @param {string}      email
 * @param {string}      password
 * 
 * @returns {Object}
 */
exports.UserUpdate = [
	//auth,
	// input is validated using body method before performing the update //
	body("lastName", "last name must not be empty.").isLength({ min: 1 }).trim(),
	body("firstName", "first name must not be empty.").isLength({ min: 1 }).trim(),
	body("email", "email must not be empty.").isLength({ min: 1 }).trim(),
	body("password", "password must not be empty").isLength({ min: 1 }).trim(),
	// .custom((value,{req}) => {
	// 	return User.findOne({Name : value,user: req.user.id, _id: { "$ne": req.params._id }}).then(user => {
	// 		if (user) {
	// 			return Promise.reject("User already exists with this name.");
	// 		}
	// 	});
	// }),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var user = new User(
				{ 	lastName: req.body.lastName,
					firstName: req.body.firstName,
					email: req.body.email,
					password: req.body.password,
					_id: req.params.id
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				console.log(req.params.id)
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					User.findById(req.params.id, function (err, foundUser) {
						if(foundUser === null){
							return apiResponse.notFoundResponse(res,"User not exists with this id");
						}else{
							// find user by given id and check if the user making the request is the one who created the user //
							if(foundUser.user.toString() !== req.user.id){
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							}else{
								// update user and return success or error message accordingly //
								User.findByIdAndUpdate(req.params.id, user, {},function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										let userData = new UserData(user);
										return apiResponse.successResponseWithData(res,"User update Success.", userData);
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
exports.UserDelete = [
	//auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			User.findById(req.params.id, function (err, foundUser) {
				if(foundUser === null){
					return apiResponse.notFoundResponse(res,"User not exists with this id");
				}else{
					//Check authorized user
					if(foundUser.user() !== req.user.id){
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					}else{
						//delete User.
						User.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return apiResponse.ErrorResponse(res, err); 
							}else{
								return apiResponse.successResponse(res,"User delete Success.");
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
