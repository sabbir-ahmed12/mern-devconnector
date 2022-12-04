require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dbConn");

// Creating app
const app = express();

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send(`${process.env.DATABASE_URI}`);
});

// User Routes
app.use("/auth", require("./routes/api/auth"));
app.use("/posts", require("./routes/api/posts"));
app.use("/profile", require("./routes/api/profile"));

// Serving port
const port = process.env.PORT || 5050;

app.listen(port, () => console.log(`Server running on port ${port}...`));
