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
    shipmentFromPlace : {
        type : String,
        required : true
    },
    shipmentFromLatitude: {
        type: String,
        required: true
    },
    shipmentFromLongitude: {
        type: String, 
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
});

const Product = mongoose.model("PRODUCTS", ProductSchema);

module.exports = {Product};