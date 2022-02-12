require("dotenv/config");

require("./db");

const express = require("express");

const hbs = require("hbs");

const app = express();

require("./config")(app);

const projectName = "myapp";

app.locals.appTitle = projectName


const indexRoutes = require("./routes/index");
app.use("/", indexRoutes);



require("./error-handling")(app);

module.exports = app;
