const express = require("express");
const router = express.Router();
const projectCtrl = require("../controllers/projectController");
const { fileStorageEngine, DocumentStorageEngine } = require("../tools/FileStorageEngine");


const { authMiddleware } = require("../middlewares/authMiddleware");
//const { checkAdminMiddleware } = require("../middlewares/checkAdminMiddleware");
const multer = require("multer");
const upload = multer({ storage: fileStorageEngine });
const documentStorage = multer({ storage: DocumentStorageEngine });

router.post("/addProject", upload.single("file"), projectCtrl.addProjects)
router.get("/getAllProjects", projectCtrl.getAllProjects);
router.get("/getAllProjectsDone", authMiddleware, projectCtrl.getAllProjectsDone);
router.get("/getAllProjectsPending", authMiddleware, projectCtrl.getAllProjectsPending);
router.get("/getAllProjectsProgress", authMiddleware, projectCtrl.getAllProjectsProgress);
router.get("/getAllProjectsTest", authMiddleware, projectCtrl.getAllProjectsTest);
router.get("/getProjectLate", authMiddleware, projectCtrl.getProjectLate);
router.get("/getEngineersParticipations",authMiddleware, projectCtrl.getEngineersParticipations)
router.get("/geTeamLeadersParticipations",authMiddleware, projectCtrl.geTeamLeadersParticipations)

router.patch("/updateStatus/:id", projectCtrl.updateStatus);
router.patch("/updateStatus/:id", projectCtrl.updateStatusToCompleted);
router.patch("/updateProject/:id", upload.single("file"), projectCtrl.updateProject);
router.patch("/deleteMember", projectCtrl.deleteMember);
router.delete("/deleteProject/:id", authMiddleware, projectCtrl.deleteProject);
router.patch("/addmemeber", projectCtrl.addTeamMember1)
router.get("/getproject/:id", projectCtrl.getProject)
router.get("/getprojectbyClient/:id", projectCtrl.getprojectbyClient)
router.post("/createProject", upload.single("file"), authMiddleware, projectCtrl.createProject)
router.get("/getmyProjects/:id", projectCtrl.getmyProjects)
router.get("/getProjectsByTeamleader/:id", projectCtrl.getProjectsByTeamleader)
router.get("/getDoneP/:id", projectCtrl.getDoneP)
router.patch("/noteCleint/:id", projectCtrl.noteCleint)
router.patch("/noteAdmin/:id", projectCtrl.noteAdmin)
router.patch("/addletter/:id", documentStorage.single("file"), projectCtrl.addletter)
router.patch("/notequipe/:id", authMiddleware, projectCtrl.notequipe)
router.patch("/progress/:id", authMiddleware, projectCtrl.progress)
router.patch("/addkik/:id", documentStorage.single("file"), projectCtrl.addkik)
router.patch("/addHLDLLD/:id", documentStorage.single("file"), projectCtrl.addHLDLLD)
router.patch("/addbuild/:id", documentStorage.single("file"), projectCtrl.addbuild)
router.patch("/addaccesd/:id", documentStorage.single("file"), projectCtrl.addaccesd)
router.patch("/addOther/:id", documentStorage.single("file"), projectCtrl.addOther)
router.patch("/addOther1/:id", documentStorage.single("file"), projectCtrl.addOther1)
router.patch("/addOther2/:id", documentStorage.single("file"), projectCtrl.addOther2)
router.patch("/addOther3/:id", documentStorage.single("file"), projectCtrl.addOther3)
router.post("/shareFile", projectCtrl.shareFile)
router.get("/overview/:userId", projectCtrl.getProjetsOverview);


module.exports = router;