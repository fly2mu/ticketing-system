require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const router = require("./routes/index");
require("./config/db");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World");
  console.log("Hello World");
});

app.use("/api", router);

app.use("*", (req, res) => {
  res.json({
    status: "failed",
    message: "404 Page Not Found",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
