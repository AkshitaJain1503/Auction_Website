require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const registerRoute = require("./routes/loginAndSignup/register");
const authLoginRoute = require("./routes/loginAndSignup/authLogin");
const myProfile = require("./routes/myAccount/myProfile");
const checkAuthLogin = require("./middleware/checkAuthLogin");
const postProduct = require("./routes/products/postProduct");
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//databse connection
connection();

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use("/api/register", registerRoute);
app.use("/api/authLogin", authLoginRoute);
app.use("/api/postProduct", postProduct);

//protected route with middleware checkAuthLogin
app.use("/api/myProfile", checkAuthLogin, myProfile);
app.use("/api/postProduct", checkAuthLogin, postProduct);

const port = process.env.PORT || 3001;
app.listen(port, function () {
    console.log("listening on port" + port);
});
