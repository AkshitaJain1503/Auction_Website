require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const registerRoute = require("./routes/loginAndSignup/register");
const authLoginRoute = require("./routes/loginAndSignup/authLogin");
const myProfile = require("./routes/userInfo/myProfile");
const userProfile = require("./routes/userInfo/buyerOrSellerProfile");
const pastPosts = require("./routes/userPastActivity/pastPosts");
const pastPurchases = require("./routes/userPastActivity/pastPurchases");
const checkAuthLogin = require("./middleware/checkAuthLogin");
const postProduct = require("./routes/products/postProduct");
const productDetails = require("./routes/products/productDetails");
const auctionSpace = require("./routes/auctionSpace/auctionSpace");
const allDaysCalendar = require("./routes/calendarView/getAllStartDays");
const specificDayCalendar = require("./routes/calendarView/getSpecificDayDetail");

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
app.use("/api/getAllStartDaysCalendar", allDaysCalendar);
app.use("/api/getSpecificDayDetailsCalendar", specificDayCalendar);

//protected routes with middleware checkAuthLogin
app.use("/api/myProfile", checkAuthLogin, myProfile);
app.use("/api/pastPosts", checkAuthLogin, pastPosts);
app.use("/api/pastPurchases", checkAuthLogin, pastPurchases);
app.use("/api/postProduct", checkAuthLogin, postProduct);
app.use("/api/auctionSpace", checkAuthLogin, auctionSpace);


app.use("/api/userProfile", checkAuthLogin, userProfile);

const port = process.env.PORT || 3001;
app.listen(port, function () {
    console.log("listening on port" + port);
});
