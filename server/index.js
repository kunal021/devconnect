const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
const connectDB = require("./config/DBConnect.js");
const rootRoute = require("./routes/root.route.js");

const app = express();

app.use(cors());
app.use(cookieParser());

app.use(bodyParser.json());

app.use("/api/v1", rootRoute);

connectDB()
  .then(() => {
    console.log("Connected to Database");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
