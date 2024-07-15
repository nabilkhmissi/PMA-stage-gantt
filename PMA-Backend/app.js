// ============imports=============
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const config = require("./src/config/config")
const cors = require("./src/config/cors")
const db_connect = require("./src/config/db_connect")
//const cors =require ("cors");
const path = require('path')
    // ============ imporing routes ================
const usersRoute = require("./src/routes/userRoute");
const projectRoute = require("./src/routes/projectRoute");
const reclamationRoute = require("./src/routes/reclamationRoute");
const taskRoute = require("./src/routes/taskRoute");
const eventRoute = require("./src/routes/eventRoute");
const procesRoute = require('./src/routes/procesvRoute')
const problemRoute = require('./src/routes/problemeRoute')
    //========== configuration ============

//app.use(bodyParser())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// ================= cors config =====================
app.use(cors);

//=========== connecting to database ==============
db_connect();

// ========= configurring routes ==========
const url = config.API_URL;
/* '/static' */
app.use('/static/images', express.static(path.join(__dirname, './src/static/images')))
app.use('/projectsFile', express.static(path.join(__dirname, './src/uploads/projects')))

//app.use(express.static('static/images'))
app.use(`${url}/users`, usersRoute);
app.use(`${url}/projects`, projectRoute);
app.use(`${url}/reclamations`, reclamationRoute);
app.use(`${url}/tasks`, taskRoute);
app.use(`${url}/events`, eventRoute);
app.use(`${url}/procesV`, procesRoute)
app.use(`${url}/problems`, problemRoute)

    // ======== exporting app ========
module.exports = app; 