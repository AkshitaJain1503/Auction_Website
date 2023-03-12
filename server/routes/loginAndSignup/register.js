//Register Route: POST
const router = require("express").Router();
const {User} = require("../../models/user");
const bcrypt = require("bcrypt");
const passwordComplexity = require('joi-password-complexity');
const Joi = require('joi');

//validate data entered by user using joi and passwordComplexity
router.post("/", async (req, res) => {
	try {
		// const validate = (data) => {
		// 	const schema = Joi.object({

		// 		password: passwordComplexity().required().label("Password")
		// 	});
		// 	return schema.validate(data);
		// };
		// const {error} = validate(req.password);
		// if (error)
		// 	return res.status(400).send({message: error.details[0].message});

		// const {error} = passwordComplexity().validate(req.password);
		// if (error){
		// console.log("uparrrrrr",error.details[0].message)
		//  	return res.status(400).send({message: error.details[0].message});}

    	// if no error occured previously check email exists or not
		let user = await User.findOne({email: req.body.email});

    	//if user already exists
		if (user)
			return res.status(409).send({message: "User with given email already Exist!"});

    	//if user doesn't exist already create new user
    	//hashing and salting
		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({...req.body, password: hashPassword}).save();
		user = await User.findOne({email: req.body.email});

		//generate a JWT (token)
		const token = user.generateAuthToken();
		res.status(201).send({data: token, message: "User created successfully"});
	} 
    //If any internal server error occured.
    catch (error) {
		console.log("hereee endddd")
		res.status(500).send({message: "Internal Server Error"});
	}
});

module.exports = router;

