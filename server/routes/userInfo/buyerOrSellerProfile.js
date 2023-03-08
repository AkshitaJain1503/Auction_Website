const router = require("express").Router();
const {User} = require("../../models/user");
const Joi = require("joi");


//Get the buyer or seller (user) profile data.
router.get("/", async (req, res) => {

    const requested_id = req.query.id;
    var userData = {}

    const user = await User.findOne({_id: requested_id});
    
    userData.name = user.name;
    userData.email = user.email;

    res.status(200).send({data:userData});
});

module.exports = router;