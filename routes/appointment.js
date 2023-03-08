var express = require("express");
const AppointmentController = require("../controllers/AppointmentController");

var router = express.Router();

router.get("/", AppointmentController.AppointmentList);
router.get("/:id", AppointmentController.AppointmentDetail);
router.post("/", AppointmentController.AppointmentStore);
router.put("/:id", AppointmentController.AppointmentUpdate);
router.delete("/:id", AppointmentController.AppointmentDelete);

module.exports = router;