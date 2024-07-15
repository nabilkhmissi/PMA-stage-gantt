const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema({
    Projectname: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: "Pending" },
    TeamLeader: { type: mongoose.Types.ObjectId, ref: "User" },
    //dealdline: { type: Date },
    dateFin: { type: Date },
    type: { type: String },


    dateDebut: { type: Date, default: Date.now() },
    file: { type: String,default:"" },
    lettre: { type: String },

    client: { type: mongoose.Types.ObjectId, ref: "User" },
    equipe: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    note_Client: { type: Number, default: 0 },
    priority: { type: String, default: "Low" },
    note_Admin: { type: Number, default: 0 },
    price: { type: Number },
    note_equipe: [{ type: Number, }],
    progress: { type: Number, default: 0, },

    kickoff: { type: String },
    HLD_LLD: { type: String },
    build_book: { type: String },
    access_document: { type: String },
    other: { type: String },
    other1: { type: String },
    other2: { type: String },
    other3: { type: String }

    
});

module.exports = mongoose.model("Project", ProjectSchema);