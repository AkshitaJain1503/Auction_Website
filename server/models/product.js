// Creating product model
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    productName : {
        type: String,
        required : true
    },
    productDescription : {
        type : String,
    },
    productBasePrice : {
        type: Number,
        required : true
    },
    shipmentFrom : {
        type : String,
        required : true
    },
    productImage: {
        type: String
    },
    seller: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
});

const Product = mongoose.model("PRODUCTS", ProductSchema);

module.exports = {Product};