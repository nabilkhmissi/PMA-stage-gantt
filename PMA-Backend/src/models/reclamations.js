const mongoose = require("mongoose");

const ReclamationSchema = mongoose.Schema({
    Title: { type: String, required: true },
    CodeRec: { type: String },
    Comment: { type: String, required: true },
    reponse: { type: String, default: "Waiting for response" },
    Type_Reclamation: { type: String, required: true },
    Addeddate: { type: String },
    client: { type: mongoose.Types.ObjectId, ref: "User" },
    project: { type: mongoose.Types.ObjectId, ref: "Project" },
    status: { type: String, default: "Pending" }
});



module.exports = mongoose.model("Reclamation", ReclamationSchema);
/* Comment: 
    Type_Reclamation:
    Addeddate: 
    client:
    project: 
    status: */