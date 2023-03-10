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
const homeUpcomingAuction= require("./routes/homePage/homeUpcomingAuction");
const homePastAuction =require("./routes/homePage/homePastAuctions");
const homeLiveAuction =require("./routes/homePage/homeLiveAuctions");
const liveAuctions = require("./routes/viewAllPage/LiveAuctions");
const pastAuctions = require("./routes/viewAllPage/pastAuctions");
const upcomingAuctions = require("./routes/viewAllPage/upcomingAuctions");
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
const cart = require("./routes/Carts/addToCart");
const deleteItem = require("./routes/Carts/deleteItem");
const allProductCarts = require("./routes/Carts/allProductCarts");
const search = require("./routes/search_page/search");
const calendar = require("./routes/calendarView/calendar");
const calendarDetails = require("./routes/calendarView/calendarDetails");

//database connection
connection();

//middlewares
app.use(express.json());
app.use(cors());
//routes
app.use("/api/LiveAuctions",liveAuctions);
app.use("/api/PastAuctions",pastAuctions);
app.use("/api/UpcomingAuctions",upcomingAuctions);
app.use("/api/homeLiveAuction",homeLiveAuction);
app.use("/api/homePastAuction",homePastAuction);
app.use("/api/homeUpcomingAuction",homeUpcomingAuction);
app.use("/api/register", registerRoute);
app.use("/api/authLogin", authLoginRoute);
app.use("/api/productDetails", productDetails);
app.use("/api/search",search);
app.use("/api/calendar", calendar);
app.use("/api/calendarDetails", calendarDetails);

//protected routes with middleware checkAuthLogin
app.use("/api/myProfile", checkAuthLogin, myProfile);
app.use("/api/pastPosts", checkAuthLogin, pastPosts);
app.use("/api/pastPurchases", checkAuthLogin, pastPurchases);
app.use("/api/postProduct", checkAuthLogin, postProduct);
app.use("/api/auctionSpace", checkAuthLogin, auctionSpace);
app.use("/api/carts", checkAuthLogin, cart);
app.use("/api/removeItem", checkAuthLogin, deleteItem);
app.use("/api/AllProductCarts", checkAuthLogin, allProductCarts);

app.use("/api/userProfile", checkAuthLogin, userProfile);

const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log("listening on port" + port);
});
