const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const api = require("./routes/apiVersion1");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
 
app.use(express.json());
app.use(morgan("combined"));

app.use(express.static(path.join(__dirname, "..", "public")));
app.use('/v1',api)

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});


module.exports = app;
