//Register Route
const router = require("express").Router();
const {User} = require("../../models/user");
const bcrypt = require("bcrypt");
const passwordComplexity = require('joi-password-complexity');
const Joi = require('joi');

router.post("/", async (req, res) => {
	try {
		const {error} = validate(req.email, req.password);
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
		const token = user.generateAuthToken();
		res.status(201).send({data: token, message: "User created successfully"});
	} 
    //If any internal server error occured.
    catch (error) {
		res.status(500).send({message: "Internal Server Error"});
	}
});

//validate data entered by user using joi and passwordComplexity
const validate = (data) => {
    const schema = Joi.object({
        // firstName: Joi.string().trim().required().label('First Name'),
        // lastName: Joi.string().trim().required().label('Last Name'),
        email: Joi.string().trim().email().required().label('Email'),
        password: passwordComplexity().required().label("Password"),
		// phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    });
    return schema.validate(data);
};

module.exports = router;


