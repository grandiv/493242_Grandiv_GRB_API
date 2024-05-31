const express = require("express");
const bookRoutes = require("./src/book/routes");

const app = express();
const port = 3000;

// Allow us to post to get json from our endpoints
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/", bookRoutes);

app.listen(port, () => console.log(`App listening on port ${port}`));
