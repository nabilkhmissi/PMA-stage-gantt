const { ObjectId } = require("mongodb");
const Event = require("../models/event");
const User = require("../models/user");

module.exports.getAllEvents = async function(req, res) {
    Event.find()
        .then((Events) => {
            res.status(200).json(Events);
        })
        .catch((error) => {
            res.status(500).json({ message: error });
        })
}
module.exports.getEventById = async function(req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message: "ID is Not valid" });
    }
    try {
        const event = await Event.findById(ID);
        res.status(200).json(event);

    } catch (error) { res.status(500).json({ message: error }) }
}


module.exports.deleteEvent = async function(req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message: "ID is Not valid" });
    }
    try {
        const event = await Event.findByIdAndRemove({ _id: ID });
        if (event) {
            res.status(200).json({ message: "Event deleted successfully" })
        }
    } catch (error) {
        res.status(500).json(error);
    }
}
module.exports.updateEvent = async function(req, res) {
    try {
        const ID = req.params.id;
        if (!ObjectId.isValid(ID)) {
            return res.status(404).json({ message: "ID is Not valid" });
        }

        const user = await User.findById(req.body.user);
        await Event.findOneAndUpdate({_id :  ID}, { $set: req.body });
        return res.status(200).json({ message: "Event Updated successfully!" });
    } catch (error) {
        return res.status(500).json({ message: error }); 
    }
}
module.exports.updateEventCategory = async function(res, req) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message: "ID is not valid" })
    }
    const body = {...req.body };
    Event.findOneAndUpdate(ID, { $set: { category: body.category } }).then(() => {
        return res.status(201).json({ message: "Event's category updated successfully" })
    }).catch((error) => {
        return res.status(500).json({ message: error });
    })
}
module.exports.getAllWorkEvent = async function(req, res) {

    Event.find({ category: "Work" })
        .then((Events) => {
            res.status(200).json(Events);
        })
        .catch((error) => {
            res.status(404).json({ message: error })
        })
}
module.exports.getAllPersonalEvent = async function(req, res) {

    Event.find({ category: "Personnal" })
        .then((Events) => {
            res.status(200).json(Events);
        })
        .catch((error) => {
            res.status(404).json({ message: error })
        })
}
module.exports.getAllTravelEvent = async function(req, res) {

    Event.find({ category: "Travel" })
        .then((Events) => {
            res.status(200).json(Events);
        })
        .catch((error) => {
            res.status(404).json({ message: error })
        })
}
module.exports.getAllFreindsEvent = async function(req, res) {

    Event.find({ category: "Freinds" })
        .then((Events) => {
            res.status(200).json(Events);
        })
        .catch((error) => {
            res.status(404).json({ message: error })
        })
}
module.exports.getAllImportantEvent = async function(req, res) {

    Event.find({ category: "Important" })
        .then((Events) => {
            res.status(200).json(Events);
        })
        .catch((error) => {
            res.status(404).json({ message: error })
        })
}
module.exports.createEvent = async function(req, res) {
    const body = {...req.body };
    try {
        let event = new Event({
            title: body.title,
            details: body.details,
            category: body.category,
            startDate: body.startDate,
            endDate: body.endDate,
            className: body.className,
            user: body.user

        });
        event = await event.save();
        return res.status(200).send({ message : "Event added successfully" });
    } catch (error) {
        return res.status(500).json({message : error})
    }
}
module.exports.getEventbyUser = async function(req, res) {
    const user = req.params.user;

    Event.find({ user: user })
        .then((Events) => {
            res.status(200).json(Events);
        })
        .catch((error) => {
            res.status(404).json({ message: error })
        })
}