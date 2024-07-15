const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true }, //category can be Work , travel ,personal ,Important,freinds
    details: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    className: { type: String },
    user: { type: mongoose.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Event", EventSchema);