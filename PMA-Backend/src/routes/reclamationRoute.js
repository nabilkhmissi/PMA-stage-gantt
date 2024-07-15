const express = require("express");
const router = express.Router();
const reclamationCtrl = require('../controllers/reclamationController')
    /*

    const { checkAdminMiddleware } = require("../middlewares/checkAdminMiddleware");*/
const { authMiddleware } = require("../middlewares/authMiddleware");
/*=======================POST=============================== */

router.post("/AddReclamation", reclamationCtrl.AddReclamation)

/*=======================GET=============================== */

router.get("/getAllReclamations", reclamationCtrl.getAllReclamations);
router.get("/getAllReclamationsByTeamLeader/:id", reclamationCtrl.getReclamationsByTeamLeader);
router.get("/getAllRecInTraetement", authMiddleware, reclamationCtrl.getAllReclamationsInTraetement);
router.get("/getAllReclamationsPending", authMiddleware, reclamationCtrl.getAllReclamationsPending);
router.get("/getAllReclamationstechnical", authMiddleware, reclamationCtrl.getAllReclamationstechnical);
router.get("/getAllReclamationsCommercial", authMiddleware, reclamationCtrl.getAllReclamationsCommercial)
router.get("/getAllReclamationstreated", authMiddleware, reclamationCtrl.getAllReclamationstreated);
router.get("/getRclms/:id", authMiddleware, reclamationCtrl.getReclamsForProduct)

router.get("/getReclamationsByclient/:id", authMiddleware, reclamationCtrl.getReclamationsByclient)

router.get("/getReclamationsByProject/:id", authMiddleware, reclamationCtrl.getReclamationsByProject)
    /*=======================Delete=============================== */

router.delete("/deleteReclamation/:id", authMiddleware, reclamationCtrl.deleteReclamation);

/*=======================PUT=============================== */
router.patch("/UpdateReclamationStatus/:id", authMiddleware, reclamationCtrl.UpdateReclamationStatus);
router.patch("/UpdateReclamation/:id", authMiddleware, reclamationCtrl.UpdateReclamation);
router.patch("/UpdateReclamationResponse/:id", authMiddleware, reclamationCtrl.UpdateReclamationResponse);

module.exports = router;