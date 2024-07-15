const express = require("express");
const router = express.Router();
const taskCtrl = require("../controllers/taskController");


const { authMiddleware } = require("../middlewares/authMiddleware");
const { checkAdminMiddleware } = require("../middlewares/checkAdminMiddleware");
const { checkTeamLeaderMiddleware } = require("../middlewares/checkTeamLeaderMiddleware");

/*=======================GET=============================== */

router.get("/getAllTasks", taskCtrl.getAllTasks);
router.get("/getAllClosedTasks", authMiddleware, taskCtrl.getAllClosedTasks);
router.get("/getAllOpenTasks", authMiddleware, taskCtrl.getAllOpenTasks);
router.get("/getAllHighTasks", authMiddleware, taskCtrl.getAllHighTasks);
router.get("/getAllMeduimTasks", authMiddleware, taskCtrl.getAllMeduimTasks);
router.get("/getAllLowTasks", authMiddleware, taskCtrl.getAllLowTasks);
router.get("/getAllBugTasks", authMiddleware, taskCtrl.getAllBugTasks);
router.get("/getAllErrorTasks", authMiddleware, taskCtrl.getAllErrorTasks);
router.get("/getAllDevTasks", authMiddleware, taskCtrl.getAllDevTasks);
router.get("/getTaskById/:id", authMiddleware, taskCtrl.getTaskById);
router.get("/getTaskByProject/:id", authMiddleware, taskCtrl.getTaskByProjectID)
router.get("/getTaskByExecutor/:id", authMiddleware, taskCtrl.getTaskByExecutor)
    /*=======================POST=============================== */
    //here only the Team Leader can create tasks 
router.post("/createTask", authMiddleware, taskCtrl.CreateTask);

/*=======================DELETE=============================== */
//only Team LeaderCan delete tasks
router.delete("/deleteTaks/:id", authMiddleware, taskCtrl.deleteTask);

/*=======================PUT=============================== */
//only Team Leader can update tasks
router.put("/updateTask/:id", taskCtrl.updateTask);

router.patch("/updateTaskStatus/:id", authMiddleware, taskCtrl.updateTaskStatus);
router.patch("/updateTaskProgress/:id", authMiddleware, taskCtrl.updatetaskProgress);
router.get("/gettskks/:id", taskCtrl.gettskks)
module.exports = router;