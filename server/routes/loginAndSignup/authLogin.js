//Authentication: Login Route
const router = require("express").Router();
const {User} = require("../../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
	try {
		const {error} = validateData(req.body);
		if (error)
			return res.status(400).send({message: error.details[0].message});

	//checking if user already exists or not via email id
		const user = await User.findOne({email: req.body.email});

	//if user does not exist
		if (!user)
			return res.status(401).send({message: "Invalid Email or Password"});

	//if email id matches, then matching the password from decrypted password in database
		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);

	//if passsword is not valid
		if (!validPassword)
			return res.status(401).send({message: "Invalid Email or Password"});

	//if email and password are valid then generate a jwt token
		const token = user.generateAuthToken();
		res.status(200).send({data: token, message: "Logged in successfully"});
	} 
	//if an internal server error occured
	catch (error) {
		res.status(500).send({message: "Internal Server Error"});
	}
});

//validate email and paswword data entered by user.
const validateData = (data) => {
	const schema = Joi.object({
		email: Joi.string().trim().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;