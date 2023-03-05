//My Profile: Get and Update data.
const router = require("express").Router();
const {User} = require("../../models/user");
const Joi = require("joi");


//Get my profile data.
router.get("/", async (req, res) => {
    var userData = {}

    const user = await User.findOne({_id: req.id});
    userData.name = user.name;
    userData.email = user.email;
    userData.address = user.address;

    res.status(200).send({data:userData});
});


//Update my profile data.
router.patch("/", async (req, res) => {

    var newValues =  {... req.body} ;

    User.findOneAndUpdate({_id: req.id}, newValues, function (err) {
        if (err)
            res.status(500).send({data:"please try again after sometime"});
        else
            res.status(200).send({data:"updated successfully"});
      }); 
});


module.exports = router;



