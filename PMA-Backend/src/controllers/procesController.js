const { ObjectId } = require("mongodb");
const ProcesV = require('../models/procesV');
const Project = require('../models/project');
const User = require('../models/user')

module.exports.getAllProcesV = async function (req, res) {
    try {
        const pvs = await ProcesV.find().populate("Project")
        .populate("Sender", "-password")
        .populate("equipe", "-password");
        return res.status(200).send(pvs);
    } catch (error) {
        return res.status(500).json({ message : error });
    }
    
};



module.exports.addProcesV = async function (req, res) {
    try {
        const users = [];
        const equipe = JSON.parse(req.body.equipe);
        for (let i = 0; i < equipe.length; i++) {
            const userID = equipe[i];
            const user = await User.findById(userID);
            users.push(user);
        }
        const _sender = await fetchUserById(req.body.Sender)
        if (!_sender) {
            return res.status(400).send({message : 'Invalid sender'});
        }
        const project = await Project.findById(req.body.Project);
        if (!project) {
            return res.status(400).send({message : 'Invalid project '})
        }
        
        let procesv = await ProcesV({
            Titre: req.body.Titre,
            description: req.body.description,
            Project: project,
            subject: req.body.subject,
            Sender: _sender,
            equipe: users,
            Type_Communication: req.body.Type_Communication
        }).save();
        return res.status(200).send({ message : "Process verbal addedd successfully" });
    } catch (error) {
        // console.log(error)
        return res.status(500).json({message : error});
    }
}

const fetchUserById = async (id) => {
    try {
        return await User.findById(id)
    } catch (error) {
        throw Error("error while fetching user with ID : " + id);
    }
}

module.exports.updateProcesv = async function (req, res) {
    try {
        const ID = req.params.id;
        const body = req.body;
        const users = [];
        const equipe = JSON.parse(req.body.equipe);
        for (let i = 0; i < equipe.length; i++) {
            const userID = equipe[i];
            const user = await fetchUserById(userID);
            users.push(user);
        }
        const _sender = await fetchUserById(req.body.Sender)
        if (!_sender) {
            return res.status(400).send({message : 'Invalid sender'});
        }
        const project = await Project.findById(req.body.Project);
        if (!project) {
            return res.status(400).send({ message : 'Invalid project'})
        }

        if (!ObjectId.isValid(ID)) {
            return res.status(404).json({ message : "ID is not valid"});
        }
        const updatedProcess = { ...body, Sender: _sender, Project: project, equipe: users };
        await ProcesV.findByIdAndUpdate(ID, { $set: updatedProcess });
        return res.status(200).json({ message : "ProcesV updated successfully" });
    } catch (error) {
        return res.status(500).json({message : error})
    }
}
module.exports.deleteProcesV = async function (req, res) {
    const ID = req.params.id;

    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    try {
        const procesV = await ProcesV.findByIdAndRemove({ _id: ID });
        if (procesV) {
            res.status(200).json({ message: "procesV deleted succefully" });
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
module.exports.getProcesById = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message: "ID is Not valid" });
    }
    try {
        const procesV = await ProcesV.findById(ID).populate("Project").populate("Sender", "-password").populate("equipe", "-password")
        res.status(200).json(procesV);

    } catch (error) { res.status(500).json({ message: error }) }
}
module.exports.getProcesByUser = async function (req, res) {
    const u = req.params.id;
    const _teamleader = await User.findById({ _id: u })
    try {
        const procesV = await ProcesV.find({ Sender: { $eq: _teamleader._id } })
            .populate("Project").
            populate("Sender", "-password").
            populate("equipe", "-password")
        res.status(200).json(procesV);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}
module.exports.getProcesByProject = async function (req, res) {
    const idP = req.params.id;
    const _project = await Project.findById({ _id: idP }).populate("client", "-password")
    try {
        const procesV = await ProcesV.find({ Project: { $eq: _project._id } })
            .populate("Project")
            .populate("Sender", "-password")
            .populate("equipe", "-password")
        res.status(200).json(procesV);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

module.exports.getProcesvByClient = async function (req, res) {
    const ID = req.params.id;
    let pvs = [];
  
    try {
      const projects = await Project.find({ client: ID });
  
      // Use Promise.all to wait for all procesV retrievals
      const procesVPromises = projects.map(async (project) => {
        return await ProcesV.find({ Project: { $eq: project._id } })
          .populate("Project")
          .populate("Sender", "-password")
          .populate("equipe", "-password");
      });
  
      const procesVs = await Promise.all(procesVPromises);
  
      pvs = procesVs.flat();
  
      return res.status(200).send(pvs);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error loading client proces verbals' });
    }
};