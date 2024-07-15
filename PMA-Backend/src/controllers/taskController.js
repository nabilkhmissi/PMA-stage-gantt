const { ObjectId } = require("mongodb");
const Task = require("../models/task");
const Project = require("../models/project");
const User = require("../models/user");
const user = require("../models/user");
const project = require("../models/project");

//getALLTasks will retur all the tasks in my database
module.exports.getAllTasks = async function (req, res) {
    try {

        const taskStatus = req.query.status;
        var tasks;
        if (taskStatus) {
            tasks = await Task.find({ Status: taskStatus }).populate("Project").populate("Executor", "-password")
        } else {
            tasks = await Task.find({}).populate("Project").populate("Executor", "-password")
        }
        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
};


/* getAllClosedTasks will return all closed tasks (Done) */
module.exports.getAllClosedTasks = async function (req, res) {
    Task.find({ Status: "Closed" }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
};


/*GetAllOpenTasks will return all open tasks */
module.exports.getAllOpenTasks = async function (req, res) {
    Task.find({ Status: "Open" }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
};


/* getAllHighTasks will tasks with High priority  */
module.exports.getAllHighTasks = async function (req, res) {
    Task.find({ Priority: "High" }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
};


/* getAllHighTasks will tasks with Meduim priority  */
module.exports.getAllMeduimTasks = async function (req, res) {
    Task.find({ Priority: "Meduim" }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
};


/* getAllHighTasks will tasks with Low priority  */
module.exports.getAllLowTasks = async function (req, res) {
    Task.find({ Priority: "Low" }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
};


//getAllBugTasks will return all tasks that there type is "Bug"
module.exports.getAllBugTasks = async function (req, res) {
    Task.find({ Type: "Bug" }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
};


//getAllBugTasks will return all tasks that there type is "Error"
module.exports.getAllErrorTasks = async function (req, res) {
    Task.find({ Type: "Error" }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
};

//getAllBugTasks will return all tasks that there type is "Development"
module.exports.getAllDevTasks = async function (req, res) {
    Task.find({ Type: "Development" }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
};


// createTask will create a task
module.exports.CreateTask = async function (req, res) {
    try {
        const project = await Project.findById(req.body.projectId);
        if (!project) {
            return res.status(400).send({ message: "Invalid Project" });
        }
        const equipe = [];
        const members = JSON.parse(req.body.Executor)
        for (i = 0; i < members.length; i++) {
            employee = await User.findById(members[i]);
            equipe.push(employee);
        }
        let task = new Task({
            Title: req.body.Title,
            Project: project,
            Details: req.body.Details,
            StartDate: req.body.StartDate,
            Executor: equipe,
            Deadline: req.body.Deadline,
            Priority: req.body.Priority,
            progress : req.body.progress,
            Status : req.body.status
        });
        task = await task.save();
        //updating project status and progress
        await updateProjectProgress(task.Project._id);

        return res.status(200).send({ message : "Task saved successfully" });
    } catch (error) {
        return res.status(500).json({ message :  error });
    }
};


// deleteTask will delete a specific task
module.exports.deleteTask = async function (req, res) {
    try {
        const task = await Task.findByIdAndRemove({ _id: req.params.id });
        if (task) {
            await updateProjectProgress(task.Project._id);
            return res.status(200).json({ message: "Task deleted successfully" });
        }
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};


module.exports.updateTask = async function (req, res) {
    try {
        const executor = [];
        const members = JSON.parse(req.body.Executor);
        if(members == 0){
            return res.status(400).send({ message: "Executors can be empty" });
        }
        for (let i = 0; i < members.length; i++) {
            const user = await User.findById(members[i]);
            executor.push(user);        
        }
        const project = await Project.findById(req.body.projectId);
        if(!project){
            return res.status(500).send({ message: "Project not found" });
        }
        const task = await Task.findByIdAndUpdate(req.params.id, {
            Title: req.body.Title,
            Project: project,
            Details: req.body.Details,
            Status: req.body.Status, //open or closed status
            StartDate: req.body.StartDate,
            Deadline: req.body.Deadline,
            Executor: executor,
            progress: req.body.progress,
            Priority: req.body.Priority
        }, { new: true })
        //updating project status and progress
        await updateProjectProgress(task.Project._id);
        
        return res.status(200).json({ message: "task Updated succcessfully !"});
    } catch (error) {
        return res.status(500).json({ message: error});
    }
    
};

async function updateProjectProgress(projectId){
    const projectTasksAll = await Task.find({ Project : projectId });
    const projectTasksCompleted = await Task.find({ Project : projectId, Status : "Closed" });
    const percentage = (projectTasksCompleted.length/projectTasksAll.length)*100;
    if(percentage == 100){
        await Project.findByIdAndUpdate({_id : projectId}, { $set: { progress : percentage, status : "Completed" } });
    }else{
        await Project.findByIdAndUpdate({_id : projectId}, { $set: { progress : percentage, status : "In Progress" } });
    }
}


//updateTasksStatus will update the status of the tasks
module.exports.updateTaskStatus = async function (req, res) {
    //here we recovery the id from the request and we verify that this id is Valid
    try {
        const ID = req.params.id;
        if (!ObjectId.isValid(ID)) {
            return res.status(404).json({ message: "ID is not valid" });
        }
        const body = { ...req.body };

        await Task.findByIdAndUpdate(ID, { $set: { Status: body.Status } }, { new: true });    
        const task = await Task.findById(ID);
        //updating project status and progress
        await updateProjectProgress(task.Project._id);

        return res.status(200).send({ message: "Task's status updated successfully" });
    
    } catch (error) {
        return res.status(500).send({ message: error });
    }
};

module.exports.updatetaskProgress = async function (req, res) {

    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message: "ID is not valid" });
    }
    const body = { ...req.body };
    Task.findByIdAndUpdate(ID, { $set: { progress: body.progress } })
        .then(() => {
            return res
                .status(200)
                .json({ message: "Task's progress updated successfully" });
        })
        .catch((error) => {
            return res.status(500).json({ message: error });
        });
};


//getTaskbyId will return a task specific task
module.exports.getTaskById = async function (req, res) {
    //here we recovery the id from the request and we verify that this id is Valid
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    try {
        const task = await Task.findById(ID).populate("Project").populate("Executor", "-password");
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
module.exports.getTaskByProjectID = async function (req, res) {
    try {
        const p = req.params.id;
        const { status, date } = req.query;
        var tasks;
        const project = await Project.findById({ _id: p });
        if (req.query.status == undefined) {
            tasks = await Task.find({ Project: project._id }).sort({ StartDate: +date }).populate("Project").populate("Executor", "-password");
        } else if (status != 'null') {
            tasks = await Task.find({ Project: project._id, Status: status }).sort({ StartDate: +date }).populate("Project").populate("Executor", "-password");
        } else {
            tasks = await Task.find({ Project: project._id }).sort({ StartDate: date }).populate("Project").populate("Executor", "-password");
        }
        return res.status(200).json(tasks);
    } catch (error) {
        res.status(404).json({ message: error });
    }
};
module.exports.getTaskByExecutor = async function (req, res) {
    const e = req.params.id
    const executor = await User.findById({ _id: e })
    Task.find({ Executor: executor._id }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
}
module.exports.gettskks = async function (req, res) {
    try {
        const leader = req.params.id;
        const _teamleader = await User.findById(leader);

        const matchingProjects = await Project.find({ TeamLeader: _teamleader._id });

        const projectIds = matchingProjects.map(project => project._id);
        const tasks = await Task.find({ Project: { $in: projectIds } })
            .populate("Project")
            .populate("Executor", "-password");

        res.status(200).json(tasks);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};