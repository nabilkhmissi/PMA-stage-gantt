const express = require("express");
const router = express.Router();
const eventCtrl = require("../controllers/eventController");

const { authMiddleware } = require("../middlewares/authMiddleware");


/*=======================GET=============================== */

router.get("/getAllEvent", authMiddleware, eventCtrl.getAllEvents);
router.get("/getEventById/:id", authMiddleware, eventCtrl.getEventById);
router.get("/getAllWorkEvent", authMiddleware, eventCtrl.getAllWorkEvent);
router.get("/getAllPersonalEvent", authMiddleware, eventCtrl.getAllPersonalEvent);
router.get("/getAllTravelEvent", authMiddleware, eventCtrl.getAllTravelEvent);
router.get("/getAllFreindsEvent", authMiddleware, eventCtrl.getAllFreindsEvent);
router.get("/getAllImportantEvent", authMiddleware, eventCtrl.getAllImportantEvent);
router.get("/getEventbyUser/:user", eventCtrl.getEventbyUser)

/*=======================POST=============================== */

router.post("/createEvent", authMiddleware, eventCtrl.createEvent);

/*=======================DELETE=============================== */

router.delete("/deleteEvent/:id", authMiddleware, eventCtrl.deleteEvent);

/*=======================PUT=============================== */

router.patch("/updateEventCategory/:id", authMiddleware, eventCtrl.updateEventCategory);
router.patch("/updateEvent/:id", authMiddleware, eventCtrl.updateEvent);

module.exports = router;