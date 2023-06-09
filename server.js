const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;
const corsOptions = require("./config/corsOptions");
// custom middleware logger
app.use(logger);
// cors options
app.use(cors(corsOptions));
//middleware to handle formdata
app.use(express.urlencoded({ extended: false }));
//middleware to handle json
app.use(express.json());
//serve static files
app.use("/", express.static(path.join(__dirname, "public")));
//routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));

app.use("/employees", require("./routes/api/employees")); //JSON data from api

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
