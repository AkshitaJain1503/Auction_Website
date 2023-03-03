require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const registerRoute = require("./routes/loginAndSignup/register");
const authLoginRoute = require("./routes/loginAndSignup/authLogin");
const myProfile = require("./routes/myAccount/myProfile");
const pastPosts = require("./routes/myAccount/pastPosts");
const pastPurchases = require("./routes/myAccount/pastPurchases");
const checkAuthLogin = require("./middleware/checkAuthLogin");
const postProduct = require("./routes/products/postProduct");
const productDetails = require("./routes/products/productDetails");
const auctionSpace = require("./routes/auctionSpace/auctionSpace");
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
app.use("/api/productDetails", productDetails);

//protected routes with middleware checkAuthLogin
app.use("/api/myProfile", checkAuthLogin, myProfile);
app.use("/api/pastPosts", checkAuthLogin, pastPosts);
app.use("/api/pastPurchases", checkAuthLogin, pastPurchases);
app.use("/api/postProduct", checkAuthLogin, postProduct);
app.use("/api/auctionSpace", checkAuthLogin, auctionSpace);


const port = process.env.PORT || 3001;
app.listen(port, function () {
    console.log("listening on port" + port);
});
