// post product details
const router = require("express").Router();
const multer = require('multer');
const {v4: uuidv4} = require("uuid");
const path = require("path");
const {Product} = require("../../models/product");
const {Auction} = require("../../models/auction");
const {User} = require("../../models/user");
var ObjectId = require('mongoose').Types.ObjectId;
const {cloudinary} = require("./cloudinary");
require("dotenv").config();

const storage = multer.diskStorage({
    // destination: function(req, file, cb) {
    //     cb(null, "images");
    // },
    filename: function(req, file, cb) {
        cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

let upload = multer({storage, fileFilter});

router.post("/", upload.single("productImage"), async (req, res) => {

    console.log("data fetched");
    const sellerId = req.id;
    const productBasePrice = req.body.productBasePrice;
    const startDateTime= req.body.startDateTime;
    // const auctionStartDate = req.body.auctionStartDate;
    // const auctionStartTime = req.body.auctionStartTime;
    const days = req.body.days;
    const minutes = req.body.minutes;
    const hours = req.body.hours;
    let auctionDuration = days +":" + minutes + ":" + hours;
    
    const result = await cloudinary.uploader.upload(req.file.path);

    const productImage = result.secure_url;

//Adding product details and sellerID in the product model.
    const product = await new Product({ ... req.body, productImage: productImage, seller: sellerId}).save();

    const auction = await new Auction({product: product._id, startDateTime, productCurrentPrice: product.productBasePrice, duration: auctionDuration}).save();
//adding ProductID against the specific seller in the user model. 
    await User.findOneAndUpdate(
        { _id: ObjectId(sellerId) }, 
        { $push: { postedProducts: ObjectId(product._id) }}
    );

    // req.id = product._id;
    res.json(product._id);
    // console.log(req.body);
});
module.exports = router;
