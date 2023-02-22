// post product details
const router = require("express").Router();
const multer = require('multer');
const {v4: uuidv4} = require("uuid");
const path = require("path");
const {Product} = require("../../models/product");
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
    const sellerId = req.id 
    
    const result = await cloudinary.uploader.upload(req.file.path);

    const productImage = result.public_id;

//Adding product details and sellerID in the product model.
    const product = await new Product({ ... req.body, productImage: productImage, seller: sellerId}).save();
    console.log(req.body);
//adding ProductID against the specific seller in the user model. 
    await User.findOneAndUpdate(
        { _id: ObjectId(sellerId) }, 
        { $push: { postedProducts: ObjectId(product._id) }}
    );

    res.json(req.body);
});
module.exports = router;
