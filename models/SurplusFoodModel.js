const mongodb = require('mongodb');

const surplusFoodSchema = new mongodb.Schema({
  restaurantName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  surplusFood: [{
    type: String,
    required: true
  }],
  quantity: [{
    type: Number,
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SurplusFood = mongodb.model('SurplusFood', surplusFoodSchema);

module.exports = SurplusFood;
