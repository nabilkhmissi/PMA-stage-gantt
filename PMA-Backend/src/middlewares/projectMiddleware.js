// const asyncHandler = require("express-async-handler");
// const Task = require("../models/task");
// const Project = require("../models/project");


// const projectStatusHundler = asyncHandler(async(req, res, next) => {
//     const projectID = req.params.id
//     const project = await Project.findById({ _id: projectID })
//     await Task.find({ Project: project._id })
//                                             .populate("Project")
//                                             .populate("Executor", "-password")
//         .then((Tasks) => {
//             for(let i=0 ;i <Tasks.length ; i++){
//                 if (Tasks[i].status === "Closed" && Task[i].progress===100 && Tasks[0].Project.){

//                 }
//             }
//             res.status(200).json(Tasks);
//         })
//         .catch((error) => {
//             res.status(404).json({ message: error });
//         });
// });

// module.exports = { projectStatusHundler };