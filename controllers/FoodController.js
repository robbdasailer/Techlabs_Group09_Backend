const SurplusFood = require('./models/SurplusFoodModel');

// Create a new document in the SurplusFood collection
const createSurplusFood = async (restaurantName, date, surplusFood, quantity) => {
  const surplus = new SurplusFood({
    restaurantName,
    date,
    surplusFood,
    quantity
  });

  try {
    const result = await surplus.save();
    return result;
  } catch (error) {
    return error;
  }
};

// Read all documents from the SurplusFood collection
const readAllSurplusFood = async () => {
  try {
    const result = await SurplusFood.find({});
    return result;
  } catch (error) {
    return error;
  }
};

// Read a specific document from the SurplusFood collection
const readSurplusFood = async (id) => {
  try {
    const result = await SurplusFood.findById(id);
    return result;
  } catch (error) {
    return error;
  }
};

// Update a specific document in the SurplusFood collection
const updateSurplusFood = async (id, updates) => {
  try {
    const result = await SurplusFood.findByIdAndUpdate(id, updates, { new: true });
    return result;
  } catch (error) {
    return error;
  }
};

// Delete a specific document from the SurplusFood collection
const deleteSurplusFood = async (id) => {
  try {
    const result = await SurplusFood.findByIdAndDelete(id);
    return result;
  } catch (error) {
    return error;
  }
};

module.exports = {
  createSurplusFood,
  readAllSurplusFood,
  readSurplusFood,
  updateSurplusFood,
  deleteSurplusFood
};


// What is this?

// FoodController.js
const Food = require('../models/FoodModel');

exports.createFoodSurplus = (req, res) => {
  const foodSurplus = new Food({
    restaurant: req.body.restaurant,
    foodType: req.body.foodType,
    quantity: req.body.quantity,
    date: req.body.date,
  });

  foodSurplus.save((error, createdFoodSurplus) => {
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    return res.status(201).json({
      success: true,
      data: createdFoodSurplus
    });
  });
};

exports.getFoodSurpluses = (req, res) => {
  Food.find({}, (error, foodSurpluses) => {
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    return res.status(200).json({
      success: true,
      data: foodSurpluses
    });
  });
};

exports.updateFoodSurplus = (req, res) => {
  Food.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (error, updatedFoodSurplus) => {
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }
      return res.status(200).json({
        success: true,
        data: updatedFoodSurplus
      });
    }
  );
};

exports.deleteFoodSurplus = (req, res) => {
  Food.findByIdAndDelete(req.params.id, (error, deletedFoodSurplus) => {
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    return res.status(200).json({
      success: true,
      data: deletedFoodSurplus
    });
  });
};