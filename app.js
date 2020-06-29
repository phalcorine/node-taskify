// Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const expsession = require("express-session");
const dotenv = require("dotenv").config({
  path: "./config/config.env",
});
const morgan = require("morgan");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(expsession);
const passport = require("passport");
const path = require("path");
const connectToDB = require("./db/connection");

// console.log(`Path to config: ${path.join(__dirname, "/config/config.env")}...`);

// Environment Config
// dotenv.config();

// Load Passport config
require("./config/passport")();

// Connect to DB
connectToDB();

// Init Express App
const app = express();

// BodyParser
app.use(
  express.urlencoded({
    extended: false,
  })
);

// JSON
app.use(express.json());

// Logging for express
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars Helpers
const { formatDate } = require("./helpers/hbs");

// Setup Handlebars
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
      formatDate,
    },
  })
);
app.set("view engine", ".hbs");

// Express session
app.use(
  expsession({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

// PAssport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Setup Routes
// import routes
const authRouter = require("./routes/auth");
const homeRouter = require("./routes/home");
const tasksRouter = require("./routes/tasks");

// setup
app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/tasks", tasksRouter);

// Configure HTTP Port
const PORT = process.env.PORT || 4500;

// Event handling
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}...`
  )
);
