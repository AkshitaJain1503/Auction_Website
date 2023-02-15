//Creating User Model
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {type: 'string', required: true},
    lastName: {type: 'string', required: true},
    email: {type: 'string', required: true},
    password: {type: 'string', required: true},
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

