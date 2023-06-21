if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "Server/.env" });
}
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const cloudinary = require("cloudinary");
const expressFileUpload = require("express-fileupload");
const connectDB = require("./config/Connection");
const userRoute = require("./routes/userRoutes");
const postRoute = require("./routes/postRoute");
const storyRoute = require("./routes/storyRoute");

const app = express();

connectDB();

//Cookies Parser
app.use(cookieParser());

// app.use(cors());

app.use(
  bodyParser.urlencoded({
    limit: "500mb",
    extended: true,
    parameterLimit: 10000000,
  })
);

app.use(expressFileUpload({ limits: { fileSize: "500mb" } }));

app.use(express.json());

//Config Cloudniary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET_KEY,
});

app.listen(8000, "localhost", () => {
  console.log("Server Running..!!");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/story", storyRoute);

//Access Front End Static Files
app.use(express.static(path.join(__dirname, "../client/build")));

//Access Front End All URL
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});
