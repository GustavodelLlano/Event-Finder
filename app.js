require("dotenv/config");

require("./db");

const express = require("express");

const hbs = require("hbs");

const app = express();

require("./config")(app);
require('./config/session.config')(app)

const projectName = "Event-finder-revolution-2_";

app.locals.appTitle = projectName
app.locals.mapsKey = process.env.MAPKEY
app.locals.ticketKey = process.env.TICKETKEY


require("./routes")(app)

require("./error-handling")(app);

module.exports = app