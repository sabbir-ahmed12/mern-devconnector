require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dbConn");
const bodyParser = require("body-parser");
const passport = require("passport");
const profileController = require("./controllers/profileController");
const postController = require("./controllers/postController");

// Creating app
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Passport middleware
app.use(passport.initialize());

// Passport Configuration
require("./config/passport")(passport);

// User Routes
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));

// APIs
app.use("/posts", require("./routes/api/post"));
// Public APIS
app.use("/handle/:handle", profileController.getUserProfileByHandle);
app.use("/user/:user_id", profileController.getUserProfileById);
app.use("/profiles/all", profileController.getAllProfiles);
app.use("/posts", postController.getPosts);
app.use("/posts/:id", postController.getPostById);
// Private APIS
app.use(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  require("./routes/api/profile")
);

app.use(
  "/post",
  passport.authenticate("jwt", { session: false }),
  require("./routes/api/post")
);

// Serving port
const port = process.env.PORT || 5050;

app.listen(port, () => console.log(`Server running on port ${port}...`));
