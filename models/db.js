const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the Restaurant schema
const RestaurantSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactInformation: { type: String, required: true },
});

// Create the FoodItem schema
const FoodItemSchema = new Schema({
    restaurantName: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    quantity: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
});

// Create the Order schema
const OrderSchema = new Schema({
    restaurantName: { type: String, required: true },
    foodItems: [{ type: Schema.Types.ObjectId, ref: 'FoodItem' }],
    quantity: { type: Number, required: true },
    deliveryDate: { type: Date, required: true },
});

// Create the User schema
const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    confirmOTP: { type: String, required: true },
    type: { type: String, required: true, default: 'DRIVER'},
});

// Create the Route schema
const RouteSchema = new Schema({
    startPoint: { type: String, required: true },
    endPoint: { type: String, required: true },
    foodItems: [{ type: Schema.Types.ObjectId, ref: 'FoodItem' }],
});

// Create the Restaurant, FoodItem, Order, and Route models
const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
const FoodItem = mongoose.model('FoodItem', FoodItemSchema);
const Order = mongoose.model('Order', OrderSchema);
const Route = mongoose.model('Route', RouteSchema);
const User = mongoose.model('User', UserSchema);

module.exports = { Restaurant, FoodItem, Order, Route, User };
