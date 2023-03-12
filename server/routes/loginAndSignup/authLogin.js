//Authentication Login Route: POST
const router = require("express").Router();
const {User} = require("../../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
	try {
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

module.exports = router;