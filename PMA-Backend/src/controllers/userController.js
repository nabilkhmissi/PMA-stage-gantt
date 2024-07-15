const { ObjectId } = require("mongodb");
const User = require("../models/user");
const Roles = require("../models/roles");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const ForgetPassword = require("../models/forgotPassword");

require("dotenv/config");

const nodemailer = require("nodemailer");
//const moment = require("moment");
const user = require("../models/user");
const reclamations = require("../models/reclamations");


module.exports.AddUser = async function(req, res, next) {
    const body = {...req.body };

    if(req.file && req.file.filename){
        body.image = req.file.filename;
    }

    try {

        hashedPassword = await bcrypt.hash(body.password, 10);
        body.password = hashedPassword;
        const user = await User.create({...body });

        //if (moment().diff(moment(body.hiringDate), "months") >= 6) {
        const _user = await User.findByIdAndUpdate(user._id);
        if (_user) {
            res.status(200).json({
                message: "User added successfully",
                user: _user,
            });

        }
        // }
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports.signUp = async function(req, res, next) {
    const body = {...req.body };
    if (req.file && req.file.filename  ) {
        body.image = req.file.filename;
    }
    try {
        hashedPassword = await bcrypt.hash(body.password, 10);
        body.password = hashedPassword;
        const existUserByEmail = await User.findOne({ email : body.email });
        if(existUserByEmail){
           return res.status(400).send({message : "This email already in use"});
        }

        const user = await User.create({...body });

        const _user = await User.findByIdAndUpdate(user._id);
        if (_user) {
            res.status(200).json({message: "Signup request sent succefully , waiting for admin confirmation"});
        }
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};
module.exports.updateAvatar = async function(req, res, next) { 
    try {
        let new_image;
        if (req.file && req.file.filename  ) {
            new_image = req.file.filename;
        }
        await User.findByIdAndUpdate({ _id : req.params.id }, { $set: { image: new_image } })
        console.log(new_image);
        return res.status(200).send({message : "Image updated successfully", data : new_image});
        } catch (error) {
        return res.status(500).send({message : error});
    }
};



module.exports.login = async function(req, res, next) {
 
    try {
        let fetchedUser = await User.findOne({ email: req.body.email }).populate(
            "roles"
        );
        if (!fetchedUser) {
            return res.status(404).json({ message: "Wrong Email or Password" });
        }

        if (!fetchedUser.isEnabled) {
            return res.status(500).json({
                message: "Unauthorised login. Waiting for register confirmation ",
            });
        }
        var result = await bcrypt.compare(req.body.password, fetchedUser.password);
        if (!result) {
            return res.status(500).json({ message: "Wrong email or password" });
        }
        const token = jwt.sign({
                email: fetchedUser.email,
                id: fetchedUser._id,
            },
            "secret_this_should_be_longer", { expiresIn: "24h" }
        );
        return res.status(200).json({
            token: token,
            expiresIn: "24h",
            fullName: fetchedUser.fullName,
            image: fetchedUser.image,
            id: fetchedUser._id,
            roles: fetchedUser.roles,
        });
    } catch (error) {
        return res.status(500).json({ message: "problem in bycript" });
    }   
};
module.exports.checkPassword = async function(req, res, next) {
    try {
        let fetchedUser = await User.findById(req.body.id);

        var result = await bcrypt.compare(req.body.password, fetchedUser.password);
        if (!result) {
            return res.status(500).json("wrong password");
        }

        return res.status(200).json("ok");
    } catch (error) {
        return res.status(500).json({ message: "problem in bycript" });
    }
};

module.exports.updateUserRoles = async function(req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    const body = {...req.body };
    // console.log(body);
    var userRoles = [];

    body.roles.forEach((role) => {
        if (role == "Engineer") {
            userRoles.push(Roles.Engineer);
        }
        if (role == "Client") {
            userRoles.push(Roles.Client);
        }
        if (role == "Team Leader") {
            userRoles.push(Roles.TeamLeader);
        }
    });
    // console.log(userRoles);
    User.findByIdAndUpdate(ID, { $set: { roles: userRoles } })
        .then(() => {
            res.status(200).json("roles updates");
        })
        .catch((error) => res.status(500).json(error));
};

module.exports.UpdateUser = async function(req, res, next) {
    try {
        const ID = req.params.id;
        const body = {...req.body };
    
        if (req.file) {
            body.image = req.file.filename;
        }
        if (!ObjectId.isValid(ID)) {
            return res.status(404).json({ message : "ID is not valid" });
        }
        const updatedUser = await User.findByIdAndUpdate(ID, { $set: body });
        return res.status(200).send({ message : "Details updated successfully" });
    } catch (error) {
        return res.status(500).send({ message : error })
    }
};

module.exports.forgotPassword = async function(req, res, next) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const code = Math.floor(Math.random() * 111111);
        await ForgetPassword.findOneAndDelete({ email: user.email });
        let forgetPassword = new ForgetPassword({
            email: req.body.email,
            code: code,
        });

        //send mail to user
        // const transporter = nodemailer.createTransport({
        //     service: "outlook",
        //     port: 587,
        //     auth: {
        //         user: "dev.app.notif@outlook.com",
        //         pass: "Connect*123",
        //         // user: process.env.EMAIL,
        //         // pass: process.env.PASSWORD,
        //     },
        // });
        // transporter.sendMail({
        //     from: process.env.EMAIL,
        //     // from: process.env.EMAIL,
        //     to: user.email,
        //     subject: "Prologic -- Verification code for changing password",
        //     text: "This is your verification code for changing password : " + code,
        // });

        forgetPassword.save();
        console.log(code);
        return res.status(200).json({ message : "Reset code sent successfully to your email" });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
};

module.exports.validateCode = async function(req, res) {
    try {
        let emailf = req.body.email;
        let forgetPassword = await ForgetPassword.findOne({
            email: emailf
        });

        if (forgetPassword.code === req.body.code) {
            return res.status(200).json({ ide: forgetPassword._id });
        } else {
            return res.status(500).json({ message: "Code expired or Invalid" });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

//switch roles
module.exports.switchRoles = async (req, res)=>{
    try {
        const { userId, role  } = req.body;
        if (!ObjectId.isValid(userId)) {
            return res.status(404).json("ID is not valid");
        }
        let fetchedUser = await User.findById(userId).populate(
            "roles"
            );
            fetchedUser.roles.pop();
            fetchedUser.roles.push(role);
            await fetchedUser.save();
            return res.status(200).json({ role : role })
        } catch (error) {
            return res.status(400).json("Oops ! An Error Occured while switching roles");
    }

}

module.exports.updatePassword = async function(req, res) {
    const {newPassword, oldPassword, userId} = req.body;
    
    try {
        if (!ObjectId.isValid(userId)) {
            return res.status(400).send({ message :  "Ooops ! Something goes wrong, please try again"});
        }
        const user = await User.findById(userId);
        
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        
        if(!isPasswordCorrect){
            return res.status(400).send({ message : "Password missmatch, try again" });
        }
        const updatedpassword = await bcrypt.hash(newPassword, 10);
        
        await User.findOneAndUpdate({ _id: userId }, { $set: { password : updatedpassword } });

        return res.status(200).send({message : "Password updated successfully"});
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};

module.exports.changePswd = async function(req, res) {
    const {forgotPwdId, email, password} = req.body;

    if (!ObjectId.isValid(forgotPwdId)) {
        return res.status(400).send("Ooops ! Something goes wrong, please try again");
    }

    try {
        const newPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate({ email: email }, { $set: { password : newPassword } });
        await ForgetPassword.findByIdAndDelete(forgotPwdId);
        return res.status(200).send({message : "Password updated successfully"});
    } catch (error) {
        return res.status(500).json({ message : error });
    }
};

module.exports.confirmSignUp = async function(req, res) {
    const ID = req.params.id;

    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }

    const user = await User.findByIdAndUpdate(ID, { isEnabled: true });
    if (user) {
        const transporter = nodemailer.createTransport({
            service: "outlook",
            port: 587,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: "Prologic -- register request accepted",
            text: "Your register request is accepted",
        });
    }

    return res.status(200).json({ message: "Account has been approved successfully" });
};

module.exports.getAllUsers = async function(req, res) {
    User.find({
            $and: [{ isEnabled: true }, { roles: { $ne: "Admin" } }],
        })
        .select("-password")

    .then((users) => {
            res.status(200).json(users);
        })
        .catch((error) => res.status(404).json({ message: error }));
};
module.exports.getAllEng = async function(req, res) {
    user.find({
            $and: [{ isEnabled: true }, {
                $or: [{ roles: { $eq: "Engineer" } }, { roles: { $eq: "Team Leader" } }]
            }]
        }).select("-password")
        .then((users) => {
            res.status(200).json(users)
        })

    .catch((error) => {
        res.status(404).json({ message: error })
    })
}
module.exports.getAllEngineersAndTeamLeaders = async function (req, res){
    try {
        const users = await User.find({ roles: { $in: ["Team Leader", "Engineer"] } });
        return res.status(200).send(users);
    } catch (error) {
        return res.status(500).send({ message : "Error getting all engineers and team leaders" });
    }
}

module.exports.getAllEngineer = async function(req, res) {
    user.find({
            $and: [{ isEnabled: true }, { roles: { $eq: "Engineer" } }, ]

        }).select("-password")
        .then((users) => {
            res.status(200).json(users)
        })

    .catch((error) => {
        res.status(404).json({ message: error })
    })
}

module.exports.getAllClient = async function(req, res) {
    user.find({
            $and: [{ isEnabled: true }, { roles: { $eq: "Client" } }],
        }).select("-password")
        .then((users) => {
            res.status(200).json(users)
        })

    .catch((error) => {
        res.status(404).json({ message: error })
    })
}
module.exports.getAllTeamLeader = async function(req, res) {
    user.find({
            $and: [{ isEnabled: true }, { roles: { $eq: "Team Leader" } }],
        }).select("-password")
        .then((users) => {
            res.status(200).json(users)
        })

    .catch((error) => {
        res.status(404).json({ message: error })
    })
}

module.exports.getSignUpRequests = async function(req, res) {
    User.find({ isEnabled: false })
        .select("-password")
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((error) => res.status(404).json({ message: error }));
};

module.exports.deleteUser = async function(req, res) {
    const ID = req.params.id;

    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    try {
        const user = await User.findByIdAndRemove(ID);
        // if (user.roles == "Client" || user.roles == "Team Leader") {
        //     await Project.findByIdAndRemove({ client: user._id });
        //     await reclamations.findByIdAndRemove({ client: user._id });
            
        // }
        return res.status(200).json({ message: "User deleted succefully" });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

module.exports.disableUser = async function(req, res) {
    const ID = req.params.id;

    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    try {
        const user = await User.findById(ID);
        user.isEnabled = false;
        user.save();
        return res.status(200).send({ message : "User account disabled successfully" });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};


module.exports.getUserById = async function(req, res) {
    const ID = req.params.id;

    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    try {
        const user = await User.findById(ID).select("-password");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

module.exports.filterUsers = async function(req, res) {
    var fullNameFilter = req.body.fullName;
    var titleFilter = req.body.title;
    var driversFilter = req.body.drivingLicense;
    var departmentFilter = req.body.department;
    if (fullNameFilter) {
        fullNameFilter = fullNameFilter.trim().length === 0 ? null : fullNameFilter;
    }
    if (titleFilter) {
        titleFilter = titleFilter.trim().length === 0 ? null : titleFilter;
    }
    if (driversFilter) {
        driversFilter = driversFilter.trim().length === 0 ? null : driversFilter;
    }
    if (departmentFilter) {
        departmentFilter =
            departmentFilter.trim().length === 0 ? null : departmentFilter;
    }

    try {
        if (driversFilter) {
            const users = await User.find({
                roles: { $ne: "Admin" },
                drivingLicense: true,
                isEnabled: true,
            });

            if (users) {
                res.status(200).json(users);
            }
        } else {
            const users = await User.find({
                $and: [
                    { roles: { $ne: "Admin" } },
                    { _id: { $ne: res.locals.user._id } },
                    { isEnabled: true },
                    {
                        $or: [{
                                fullName: fullNameFilter ?
                                    new RegExp(fullNameFilter, "i") : new RegExp("[a-zA-Z]"),
                            },
                            {
                                title: titleFilter ?
                                    new RegExp(titleFilter, "i") : new RegExp("[a-zA-Z]"),
                            },
                            {
                                department: departmentFilter ?
                                    new RegExp(departmentFilter, "i") : new RegExp("[a-zA-Z]"),
                            },
                        ],
                    },
                ],
            });

            if (users) {
                res.status(200).json(users);
            }
        }
    } catch (error) {
        res.status(500).json(error);
    }
};
module.exports.getusername = async function(req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    try {
        const user = await User.findById(ID);
        res.status(200).json(user.fullName);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

module.exports.searchUsers = async function(req, res) {
    var fullNameFilter = req.body.fullName;
    var addressFilter = req.body.address;
    var titleFilter = req.body.title;
    var departmentFilter = req.body.department;
    var isNotEnabledFilter = req.body.isEnabled;
    if (fullNameFilter) {
        fullNameFilter = fullNameFilter.trim().length === 0 ? null : fullNameFilter;
    }
    if (titleFilter) {
        titleFilter = titleFilter.trim().length === 0 ? null : titleFilter;
    }

    if (departmentFilter) {
        departmentFilter =
            departmentFilter.trim().length === 0 ? null : departmentFilter;
    }
    if (addressFilter) {
        addressFilter = addressFilter.trim().length === 0 ? null : addressFilter;
    }
    if (isNotEnabledFilter) {
        isNotEnabledFilter =
            isNotEnabledFilter.trim().length === 0 ? null : isNotEnabledFilter;
    }

    try {
        const users = await User.find({
            roles: { $ne: "Admin" },
            isEnabled: isNotEnabledFilter ? false : true,
            _id: { $ne: res.locals.user._id },
            fullName: fullNameFilter ?
                new RegExp(fullNameFilter, "i") : new RegExp("[a-zA-Z]"),

            title: titleFilter ?
                new RegExp(titleFilter, "i") : new RegExp("[a-zA-Z]"),
            address: addressFilter ?
                new RegExp(addressFilter, "i") : new RegExp("[a-zA-Z]"),

            department: departmentFilter ?
                new RegExp(departmentFilter, "i") : new RegExp("[a-zA-Z]"),
        });

        if (users) {
            res.status(200).json(users);
        }
    } catch (error) {
        res.status(500).json(error);
    }
};