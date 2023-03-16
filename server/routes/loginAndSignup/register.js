//Register Route: POST
const router = require("express").Router();
const {User} = require("../../models/user");
const bcrypt = require("bcrypt");
const passwordComplexity = require('joi-password-complexity');
const Joi = require('joi');

//validate data entered by user using joi and passwordComplexity
router.post("/", async (req, res) => {
	try {

		//validates the password according to passwordComplexity
		const {error} = validate({password:req.body.password});
		if (error)
			return res.status(400).send({message: error.details[0].message});

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
		res.status(500).send({message: "Internal Server Error"});
	}
});

// to check password complexity with given options
// {
// 	min: 8,
// 	max: 26,
// 	lowerCase: 1,
// 	upperCase: 1,
// 	numeric: 1,
// 	symbol: 1,
// 	requirementCount: 4,
//   }
const validate = (data) => {
	const schema = Joi.object({
		password: passwordComplexity().required().label("Password")
	});
	return schema.validate(data);
};

module.exports = router;