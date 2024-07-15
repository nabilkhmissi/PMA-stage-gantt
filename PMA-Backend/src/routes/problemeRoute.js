const express = require("express");
const router = express.Router();
const probCtr = require("../controllers/problemeController")
const { authMiddleware } = require("../middlewares/authMiddleware");



router.get("/getAllProblemes",authMiddleware, probCtr.getAllProblemes);
router.get("/getProbyUSer/:id",authMiddleware, probCtr.getProbyUSer);
router.get("/getProbyProj/:id",authMiddleware, probCtr.getProbyProj);
router.get("/getProblemsByEquipeMember/:id",authMiddleware, probCtr.getProblemsByEquipeMember);

router.post("/createProb",authMiddleware, probCtr.createProb);
router.delete("/deleteProbleme/:id",authMiddleware, probCtr.deleteProbleme)
router.patch("/updateProbleme/:id",authMiddleware, probCtr.updateProbleme)

module.exports = router;