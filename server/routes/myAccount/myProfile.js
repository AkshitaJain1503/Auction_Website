//My Profile: Get and Update data.
const router = require("express").Router();
const {User} = require("../../models/user");
const Joi = require("joi");


//Get my profile data.
router.get("/", async (req, res) => {
    var userData = {}

    const user = await User.findOne({_id: req.id});
    userData.name = user.name;
    // userData.lastName = user.lastName;
    userData.email = user.email;
    userData.address = user.address;

    res.status(200).send({data:userData});
});


//Update my profile data.
router.patch("/", async (req, res) => {

    //const {error} = validateForUpdation(req.body);
	// if (error)
	// 	return res.status(400).send({message: error.details[0].message});

    // var updateFirstName = req.body.firstName.trim();
    // var updateLastName = req.body.lastName.trim();
    var newValues =  {... req.body} ;

    User.findOneAndUpdate({_id: req.id}, newValues, function (err) {
        if (err)
            res.status(500).send({data:"please try again after sometime"});
        else
            res.status(200).send({data:"updated successfully"});
      }); 
});


//Validate data entered by the user.
// const validateForUpdation = (data) => {
//     const schema = Joi.object({
//         firstName: Joi.string().trim().required().label('First Name'),
//         lastName: Joi.string().trim().required().label('Last Name'),
//     });
//     return schema.validate(data);
// };

module.exports = router;



