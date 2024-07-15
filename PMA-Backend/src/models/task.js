const mongoose = require("mongoose");



const TaskSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Project: { type: mongoose.Types.ObjectId, ref: "Project" },
    Details: { type: String},
    Status: { type: String, default: "Pending" }, //open or closed status
    StartDate: { type: Date, default: Date.now },
    Deadline: { type: Date },
    Executor: [{ type: mongoose.Types.ObjectId, ref: "User" }],
   // Type: { type: String, },
    progress: { type: Number, default: 0 },
    Priority: { type: String, default: "High" } //Priority has 3 values : High , Meduim , Low 
});



module.exports = mongoose.model("Task", TaskSchema);