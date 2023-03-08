var express = require("express");
const RestaurantController = require("../controllers/RestaurantController");

var router = express.Router();

router.get("/", RestaurantController.RestaurantList);
router.get("/:id", RestaurantController.RestaurantDetail);
router.post("/", RestaurantController.RestaurantStore);
router.put("/:id", RestaurantController.RestaurantUpdate);
router.delete("/:id", RestaurantController.RestaurantDelete);

module.exports = router;