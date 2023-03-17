//Creating User Model
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    country:{
        type: String,
        required: true,
    },
    state:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    latitude:{
        type: String,
        required: true,
    },
    longitude:{
        type: String,
        required: true,
    },
    purchasedProducts: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
        },
    ],
    postedProducts: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
        },
    ],
    watchList: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Auction',
        },
    ],
});

//generate jwt 
//this token will expire in 7 days as mentioned.
userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWTPRIVATEKEY, {expiresIn: "7d"});
    return token;
};

//User model named as "user" with userSchema
const User = mongoose.model("user", userSchema);

module.exports = {User};

