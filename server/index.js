require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const registerRoute = require("./routes/loginAndSignup/register");
const authLoginRoute = require("./routes/loginAndSignup/authLogin");
const myProfile = require("./routes/myAccount/myProfile");
const checkAuthLogin = require("./middleware/checkAuthLogin");

//databse connection
connection();

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use("/api/register", registerRoute);
app.use("/api/authLogin", authLoginRoute);

//protected route with middleware checkAuthLogin
app.use("/api/myProfile", checkAuthLogin, myProfile);

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("listening on port" + port);
});
