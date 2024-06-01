const express = require("express");
const bodyParser = require("body-parser");
const bookRoutes = require("./src/book/routes");

const app = express();
// const port = 3000;
require("dotenv").config();

// Allow us to post to get json from our endpoints
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/", bookRoutes);

app.listen(process.env.PORT, () =>
  console.log(`App listening on port ${process.env.PORT}`)
);
