const { ObjectId } = require("mongodb");
const Project = require("../models/project");
const User = require("../models/user");
const Task = require("../models/task");
const Reclamation = require("../models/reclamations");
const Probleme = require("../models/probleme");
const Process = require("../models/procesV");
const project = require("../models/project");
const nodemailer = require("nodemailer");
const task = require("../models/task");
const reclamations = require("../models/reclamations");
const probleme = require("../models/probleme");

module.exports.getAllProjects = async function (req, res) {
    try {
        const year = req.query.year;
        var projects;
        if (year) {
            projects = await Project.find({
                $expr: {
                    $eq: [{ $year: '$dateDebut' }, year],
                },
            })
                .populate("equipe", "-password")
                .populate("client", "-password")
                .populate("TeamLeader", "-password");
        } else {
            projects = await Project.find()
                .populate("equipe", "-password")
                .populate("client", "-password")
                .populate("TeamLeader", "-password");
        }
        return res.status(200).json(projects);
    } catch (error) {
        res.status(404).json({ message: error })
    }
}

module.exports.getEngineersParticipations = async (req, res) => {
    try {
        const query = Project.aggregate([
            {
                $unwind: '$equipe',
            },
            {
                $group: {
                    _id: '$equipe',
                    projects: { $sum: 1 },
                },
            },
        ]);
        const results = await query.exec();
        const promises = results.map(async (item) => {
            const user = await User.findById(item._id).select("-password");
            return { user: user, projects: item.projects };
        });

        const participations = await Promise.all(promises);
        return res.status(200).send(participations);
    } catch (error) {
        res.status(500).send({ message: error });
    }
}
module.exports.geTeamLeadersParticipations = async (req, res) => {
    try {
        const query = Project.aggregate([
            {
                $unwind: '$TeamLeader',
            },
            {
                $group: {
                    _id: '$TeamLeader',
                    projects: { $sum: 1 },
                },
            },
        ]);
        const results = await query.exec();
        const promises = results.map(async (item) => {
            const user = await User.findById(item._id).select("-password");
            return { user: user, projects: item.projects };
        });

        const participations = await Promise.all(promises);
        return res.status(200).send(participations);
    } catch (error) {
        res.status(500).send({ message: error });
    }
}

module.exports.getAllProjectsDone = async function (req, res) {
    Project.find({ status: "Completed" }).then((projects) => {
        res.status(200).json(projects);
    });
};
module.exports.getAllProjectsPending = async function (req, res) {
    Project.find({ status: "Pending" }).then((projects) => {
        res.status(200).json(projects);
    });
};
module.exports.getAllProjectsProgress = async function (req, res) {
    Project.find({ status: "In Progress" }).then((projects) => {
        res.status(200).json(projects);
    });
};
module.exports.getAllProjectsTest = async function (req, res) {
    Project.find({ status: "Test" }).then((projects) => {
        res.status(200).json(projects);
    });
};

module.exports.deleteProject = async function (req, res) {
    const ID = req.params.id;

    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    try {
        const project = await Project.findByIdAndRemove({ _id: ID });
        // console.log(project);
        if (project) {
            await Task.deleteMany({ Project: project._id });
            await Reclamation.deleteMany({ project: project._id });
            await Probleme.deleteMany({ project: project._id });
            await Process.deleteMany({ project: project._id });

            res.status(200).json({ message: "project deleted succefully" });
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

module.exports.getProjectLate = async function (req, res) {
    Project.find({
        $and: [
            { dateFin: { $lt: new Date() } },
            { status: "Pending" },
            { status: "Test" },
        ],
    }).then((projects) => {
        res.status(200).json(projects);
    });
};
module.exports.updateStatus = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({message : "ID is not valid"});
    }
    const body = { ...req.body };
    //console.log(req.body.status);

    Project.findByIdAndUpdate(ID, { $set: body })
        .then(() => {
            res.status(200).json({ message: " project status updated" });
        })
        .catch((error) => res.status(500).json({message : error}));
};
module.exports.updateStatusToCompleted = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }

    Project.findByIdAndUpdate(ID, { $set: { status: "Completed" } })
        .then(() => {
            res.status(200).json({ message: " project completed" });
        })
        .catch((error) => res.status(500).json(error));
};

module.exports.addProjects = async function (req, res) {
    const body = { ...req.body };

    // body.file = req.file.filename;
    var users = [];
    var eq = [];

    try {
        users = JSON.parse(body.equipe);
        for (i = 0; i < users.length; i++) {
            //console.log(users[i]);
            const _equipe = await User.findById({ _id: users[i] });
            //console.log(_equipe);
            if (!_equipe) {
                return res.status(400).send("Invalid user :equipe");
            }
            eq.push(_equipe);
        }
        /*   const _equipe = await User.findById({ _id: body.equipe })
              console.log(_equipe);
              if (!_equipe) {
                  return res.status(400).send('Invalid user :equipe')
              } */
        const _client = await User.findById({ _id: body.client });
        //console.log(_client);
        if (!_client) {
            return res.status(400).send({ message : "Invalid user :client"});
        }
        const _teamLeader = await User.findById({ _id: body.TeamLeader });
        if (!_teamLeader) {
            return res.status(400).send({message : "Invalid user :client"});
        }
        /* const project = await Project.create({...body });
            const _project = await Project.findByIdAndUpdate(project._id);
            if (_project) {
                res.status(200).json({
                    project: _project,
                    message: "project added"
                }) 
            }*/
        let project = new Project({
            Projectname: body.Projectname,
            description: body.description,
            status: body.status,
            client: _client._id,
            //price: body.price,
            priority: body.priority,
            //file: body.file,
            TeamLeader: _teamLeader._id,
            // dealdline: body.dealdline,
            dateFin: body.dateFin,
            type: body.type,
            dateDebut: body.dateDebut,
            //file: body.file,
            equipe: eq,
        });
        project = await project.save();
        res.status(200).send({ message : "Project added successfully" });
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};
module.exports.createProject = async function (req, res) {
    const body = { ...req.body };
    body.file = req.file.filename;
    try {
        const client = await User.findById(body.client);
        if (!client) {
            return res.status(400).send("Invalid user :client");
        }
        let project = new Project({
            Projectname: body.Projectname,
            description: body.description,
            //status: body.status,
            client: client._id,
            price: body.price,
            dateFin: body.dateFin,
            type: body.type,

            file: body.file,
        });
        project = await project.save();
        res.send(project);
    } catch (error) {
        return res.status(500).json(error);
    }
};
module.exports.updateProject = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message : "ID is not valid" });
    }
    const body = { ...req.body };
    // console.log(req.body);
    let users = [];
    let eq = [];
    if (body.equipe) {
        users = JSON.parse(body.equipe);
        for (i = 0; i < users.length; i++) {
            // console.log(users[i]);
            const _equipe = await User.findById({ _id: users[i] });
            // console.log(_equipe);
            if (!_equipe) {
                return res.status(400).send({ message : "Invalid user :equipe" });
            }
            eq.push(_equipe);
        }
        body.equipe = eq;
    }
    Project.findByIdAndUpdate(ID, { $set: body })
        .then(() => {
            return res.status(200).json({ message : "project updated successfully" });
        })
        .catch((err) => {
            return res.status(500).json({ message : err });
        });
};

module.exports.addTeamMember1 = async function (req, res) {
    const { projectId, memeberId } = req.body;

    const addmemeber = await Project.findByIdAndUpdate(
        projectId, { $push: { equipe: memeberId } }, { new: true }
    )
        .populate("equipe", "-password")
        .populate("client", "-password")
        .populate("chefProject", "-password");
    if (!addmemeber) {
        res.status(500).json({ message: "project not found" });
    } else {
        res.status(200).json(addmemeber);
    }
};
module.exports.deleteMember = async function (req, res) {
    const { projectId, memeberId } = req.body;
    const removedmember = await Project.findByIdAndUpdate(
        projectId, { $pull: { equipe: memeberId } }
    )
    if (!removedmember) {
        res.status(500).json({ message: "project not found" });
    } else {
        res.status(200).json({ message : "member deleted succesfully" });
    }
};
module.exports.getProject = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    try {
        const projet = await Project.findById(ID)
            .populate("equipe", "-password")
            .populate("client", "-password")
            .populate("TeamLeader", "-password");
        res.status(200).json(projet);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
module.exports.getProjetsOverview = async function (req, res) {
    const projects_response = [];
    let projects;

    try {
        // Fetch projects based on user role
        if (req.query.role === "client") {
            projects = await Project.find({ client: req.params.userId })
        } else if (req.query.role === "admin") {
            projects = await Project.find()
        } else if (req.query.role === "engineer") {
            projects = await Project.find({ equipe: { $in: req.params.userId } })
        } else if (req.query.role === "team leader") {
            projects = await Project.find({ TeamLeader: req.params.userId })
        }

        // Fetch tasks, claims, processes, and risks for each project concurrently
        await Promise.all(projects.map(async (project) => {
            const [p, tasks, claims, procesv, risks] = await Promise.all([
                Project.findById(project._id)  
                    .populate("equipe", "-password")
                    .populate("client", "-password")
                    .populate("TeamLeader", "-password"),
                Task.find({ Project: project._id }),
                Reclamation.find({ project: project._id }),
                Process.find({ Project: project._id }),
                Probleme.find({ project: project._id })
            ]);

            projects_response.push({
                project : p,
                tasks: tasks.length,
                claims: claims.length,
                procesv: procesv.length,
                risks: risks.length,
            });
        }));
      return res.status(200).json(projects_response);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports.getprojectbyClient = async function (req, res) {
    const u = req.params.id;
    const _client = await User.findById({ _id: u });
    Project.find({ client: _client._id })
        .populate("equipe", "-password")
        .populate("client", "-password")
        .populate("TeamLeader", "-password")
        .then((projects) => {
            res.status(200).json(projects);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
};
module.exports.getmyProjects = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message: "ID is not valid" });
    }

    Project.find({ equipe: { $in: ID } })
        .populate("equipe", "-password")
        .populate("client", "-password")
        .populate("TeamLeader", "-password")
        .then((projects) => {
            res.status(200).json(projects);
        })

        .catch((error) => {
            res.status(404).json({ message: error });
        });
};
module.exports.getProjectsByTeamleader = async function (req, res) {
    const t = req.params.id;

    const _teamleader = await User.findById({ _id: t });

    Project.find({ TeamLeader: _teamleader._id })
        .populate("equipe", "-password")
        .populate("client", "-password")
        .populate("TeamLeader", "-password")
        .then((projects) => {
            res.status(200).json(projects);
        })

        .catch((error) => {
            res.status(404).json({ message: error });
        });
};
module.exports.getDoneP = async function (req, res) {
    const u = req.params.id;
    const _user = await User.findById({ _id: u });
    Project.find({
        $and: [
            { $or: [{ equipe: { $in: _user._id } }, { client: _user._id }] },
            { status: "Completed" },
            { progress: 100 },
        ],
    })
        .populate("equipe", "-password")
        .populate("client", "-password")
        .populate("TeamLeader", "-password")
        .then((projects) => {
            res.status(200).json(projects);
        })

        .catch((error) => {
            res.status(404).json({ message: error });
        });
};
module.exports.notequipe = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message: "ID is not valid" });
    }

    const addmemebern = await Project.findByIdAndUpdate(
        ID, { $push: { note_equipe: req.body.note } }, { new: true }
    );
    if (!addmemebern) {
        res.status(500).json({ message: "project not found" });
    } else {
        res.status(200).json(addmemebern);
    }
};

module.exports.noteCleint = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message: "ID is not valid" });
        }
    Project.findOneAndUpdate({_id : ID}, { $set: { note_Client: req.body.note } })
    .then(() => {
        return res
        .status(200)
        .json({ message: "Thank you for your note" });
        })
        .catch((error) => {
            return res.status(500).json({ message: error });
            });
};
module.exports.noteAdmin = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message: "ID is not valid" });
    }
    const body = { ...req.body };
    Project.findOneAndUpdate(ID, { $set: { note_Admin: body.note } })
        .then(() => {
            return res
                .status(201)
                .json({ message: "Task's status updated successfully" });
        })
        .catch((error) => {
            return res.status(500).json({ message: error });
        });
};
module.exports.addletter = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({message : "ID is not valid"});
    }
    const body = { ...req.body };
    body.file = req.file.filename;
    Project.findByIdAndUpdate(ID, { $set: { lettre: body.file } })
        .then(() => {
            return res.status(200).json({message : "file uploaded successfully", data : req.file.filename});
        })
        .catch((err) => {
            return res.status(500).json({message : err});
        });
};
// module.exports.progress = async function(req, res) {
//     const ID = req.params.id;
//     if (!ObjectId.isValid(ID)) {
//         return res.status(404).json("ID is not valid");
//     }
//     await Project.findByIdAndUpdate(ID, { $set: { progress: req.body.progress } })
//         .then(async() => {
//             if ((req.body.progress==100) && (kickoff!="") && (HLD_LLD!="") && (build_book!="") && (access_document!="")){
//                await Project.findByIdAndUpdate(ID, {status:"Completed"})
//             }
//             return res.status(201).json("progress updated");
//         })
//         .catch((err) => {
//             return res.status(500).json(err);
//         });
// };
module.exports.progress = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({message : "ID is not valid"});
    }
    Project.findByIdAndUpdate(ID, { $set: { progress: req.body.progress } })
        .then(() => {
            return res.status(200).json({message :  "progress updated"});
        })
        .catch((err) => {
            return res.status(500).json({message : err});
        });
};
module.exports.addkik = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    const body = { ...req.body };
    body.file = req.file.filename;
    Project.findByIdAndUpdate(ID, { $set: { kickoff: body.file } })
        .then(() => {
            return res.status(200).send({message : "file uploaded successfully", data : req.file.filename} );
        })
        .catch((err) => {
            return res.status(500).json({ message : err });
        });
};
module.exports.addHLDLLD = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    const body = { ...req.body };
    body.file = req.file.filename;
    Project.findByIdAndUpdate(ID, { $set: { HLD_LLD: body.file } })
        .then(() => {
            return res.status(200).send({message : "file uploaded successfully", data : req.file.filename} );
        })
        .catch((err) => {
            return res.status(500).send({message : err});
        });
};
module.exports.addbuild = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    const body = { ...req.body };
    body.file = req.file.filename;
    Project.findByIdAndUpdate(ID, { $set: { build_book: body.file } })
        .then(() => {
            return res.status(200).send({message : "file uploaded successfully", data : req.file.filename} );
        })
        .catch((err) => {
            return res.status(500).json({message : err});
        });
};
module.exports.addaccesd = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    const body = { ...req.body };
    body.file = req.file.filename;
    Project.findByIdAndUpdate(ID, { $set: { access_document: body.file } })
        .then(() => {
            return res.status(200).send({message : "file uploaded successfully", data : req.file.filename} );
        })
        .catch((err) => {
            return res.status(500).json({message : err});
        });
};
module.exports.addOther = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    const body = { ...req.body };
    body.file = req.file.filename;
    Project.findByIdAndUpdate(ID, { $set: { other: body.file } })
        .then(() => {
            return res.status(200).send({message : "file uploaded successfully", data : req.file.filename} );
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
};
module.exports.addOther1 = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    const body = { ...req.body };
    body.file = req.file.filename;
    Project.findByIdAndUpdate(ID, { $set: { other1: body.file } })
        .then(() => {
            return res.status(200).send({message : "file uploaded successfully", data : req.file.filename} );
        })
        .catch((err) => {
            return res.status(500).json({message : err});
        });
};
module.exports.addOther2 = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    const body = { ...req.body };
    body.file = req.file.filename;
    Project.findByIdAndUpdate(ID, { $set: { other2: body.file } })
        .then(() => {
            return res.status(200).send({message : "file uploaded successfully", data : req.file.filename} );
        })
        .catch((err) => {
            return res.status(500).json(err);
        });
};
module.exports.addOther3 = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    const body = { ...req.body };
    body.file = req.file.filename;
    Project.findByIdAndUpdate(ID, { $set: { other3: body.file } })
        .then(() => {
            return res.status(200).send({message : "file uploaded successfully", data : req.file.filename} );
        })
        .catch((err) => {
            return res.status(500).json({message : err});
        });
};
module.exports.shareFile = async function(req, res) {
    const receiverEmail = req.body.receiverEmail
    const fileName = req.body.fileName;
    const projectName = req.body.projectName
    if (receiverEmail && fileName && projectName) {
        let address = "https://pma-backend.prologic.com.tn:3002/projectsFile/"
        const transporter = nodemailer.createTransport({
            service: "outlook",
            port: 587,
            auth: {
                // user: "dev.app.notif@outlook.com",
                // pass: "Connect*123",
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL, 
            to: receiverEmail,
            subject: 'Shared file',
            html: 
            '<div style="color:#141E46;font-size:16;font-family: Verdana, Tahoma, sans-serif;border-radius:10px 10px 10px 10px; height: 500px;">'+
            '<span>The file shared below is from the project (' + projectName + ').<br> <strong style="color:#C70039;font-weight:bold;">PS: THIS FILE IS CONFIDENTIAL AND YOU CANNOT SHARE IT WITH ANYONE.</strong></span><br>'+
            '<span><strong>File : </strong><a style="text-decoration:none;" href="'+address+fileName+'">'+fileName+'</span>'+
            '</div>'
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            return res.status(500).send({message: 'Email not sent'});
          } else {
            return res.status(200).send({message : 'Email sent'});
          }
        });
        console.log("received")
        return res.status(200).send({message : 'File sent successfully'});
      }

};