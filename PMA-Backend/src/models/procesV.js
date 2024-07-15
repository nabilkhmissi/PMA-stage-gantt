const mongoose = require("mongoose");


const ProcesvSchema = mongoose.Schema({
    Titre: { type: String, required: true },
    description: { type: String, required: true },
    Project: { type: mongoose.Types.ObjectId, ref: "Project" },
    Type_Communication: { type: String },
    Date: { type: Date, default: Date.now },
    //file: { type: String },
    Sender: { type: mongoose.Types.ObjectId, ref: "User" },
    equipe: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    //subject: { type: String }
});



module.exports = mongoose.model("ProcesV", ProcesvSchema);