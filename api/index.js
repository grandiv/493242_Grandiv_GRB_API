const express = require("express");
const bodyParser = require("body-parser");
const bookRoutes = require("../src/book/routes"); // Adjust the path to routes

const app = express();

// Allow us to post to get json from our endpoints
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/", bookRoutes);

// Export the Express app wrapped in a serverless function
module.exports = app;
