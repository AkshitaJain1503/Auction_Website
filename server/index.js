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
const homeUpcomingAuction = require("./routes/home/homeUpcomingAuction");
const homePastAuction = require("./routes/home/homePastAuctions");
const homeLiveAuction = require("./routes/home/homeLiveAuctions");
const liveAuctions = require("./routes/viewAllPage/liveAuctions");
const pastAuctions = require("./routes/viewAllPage/pastAuctions");
const upcomingAuctions = require("./routes/viewAllPage/upcomingAuctions");
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
const addToWatchList = require("./routes/watchList/addToWatchList");
const deleteItem = require("./routes/watchList/deleteItem");
const watchList = require("./routes/watchList/watchList");
const search = require("./routes/search/search");
const calendar = require("./routes/calendarView/calendar");
const calendarDetails = require("./routes/calendarView/calendarDetails");
const contacts=require("./routes/contact/index");
const auctionsScheduler = require("./routes/auctionSpace/auctionsScheduler");

//database connection
connection();

//auctions start and end event scheduler
auctionsScheduler.scheduleAll();

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use("/api/liveAuctions", liveAuctions);
app.use("/api/pastAuctions", pastAuctions);
app.use("/api/upcomingAuctions", upcomingAuctions);
app.use("/api/homeLiveAuction", homeLiveAuction);
app.use("/api/homePastAuction", homePastAuction);
app.use("/api/homeUpcomingAuction", homeUpcomingAuction);
app.use("/api/register", registerRoute);
app.use("/api/authLogin", authLoginRoute);
app.use("/api/productDetails", productDetails);
app.use("/api/search", search);
app.use("/api/calendar", calendar);
app.use("/api/calendarDetails", calendarDetails);

//protected routes with middleware checkAuthLogin
app.use("/api/myProfile", checkAuthLogin, myProfile);
app.use("/api/pastPosts", checkAuthLogin, pastPosts);
app.use("/api/pastPurchases", checkAuthLogin, pastPurchases);
app.use("/api/postProduct", checkAuthLogin, postProduct);
app.use("/api/auctionSpace", checkAuthLogin, auctionSpace);
app.use("/api/addToWatchList", checkAuthLogin, addToWatchList);
app.use("/api/removeItem", checkAuthLogin, deleteItem);
app.use("/api/myChats",checkAuthLogin,contacts);
app.use("/api/watchList", checkAuthLogin, watchList);
app.use("/api/userProfile", checkAuthLogin, userProfile);

const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log("listening on port" + port);
});
