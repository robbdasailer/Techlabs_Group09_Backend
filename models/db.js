const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the Restaurant schema
const RestaurantSchema = new Schema({
    name: { type: String, required: true },
    coordinates: { type: [Number], required: true },      
    address: { 
        street: String,
        number: Number,
        city: String,
        postalCode: Number,
        },
    contactInformation: { 
        phone: {type: String, required: true },
        email: {type: String, required: true },
    },
    picture: { type: String},
    employees: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
});

// Create the User schema
const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    confirmOTP: { type: String, required: false },
    isConfirmed: { type: Boolean, required: true, default: false },
    status: { type: Boolean, required: true, default: true },
    type: { type: String, enum: ['DRIVER','EMPLOYEE','ADMIN'], required: true, default: 'DRIVER'},
});

// Create the Route schema
const RouteSchema = new Schema({
    startPoint: { type: String, required: true },
    endPoint: { type: String, required: true },
   // order: [RestaurantSchema.name], //How can I refer to the name of the restarant?
});

// Create the FoodItem schema
const FoodItemSchema = new Schema({
    name: {type: String, required: true},
    unit: { type: String, enum: ['KG','LITER','PIECE','BOX'], required: true },
    quantity: { type: Number, required: true},
})

// Create the Appointment schema
const AppointmentSchema = new Schema({
    food: { type: [FoodItemSchema], required: true },
    pickupDateAndTime: {type: Date, required: true},
    driver: { type: Schema.Types.ObjectId, ref: 'User'},
    restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true},
    coordinates: { type: [Number], required: true },
})

// Create the Restaurant, FoodItem, Order, and Route models // What for?
const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
const User = mongoose.model('User', UserSchema);
const Route = mongoose.model('Route', RouteSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema)
module.exports = { Restaurant, User, Route, Appointment };