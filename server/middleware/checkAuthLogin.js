const jwt = require('jsonwebtoken');
const {User} = require('../models/user');  
var ObjectId = require('mongoose').Types.ObjectId;

const checkAuthLogin = async (req, res, next) => {
    try { 
        if(req.header('Authorization') == null || req.header('Authorization') == ""){
            res.status(404).send({error: 'Jwt missing'})
        }
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        const rootUser = await User.findOne({_id: ObjectId(decoded._id)});

        if (!rootUser || rootUser==null) {
            res.status(404).send({error: 'User not found'})
        }

        req.token = token;
        req.rootUser = rootUser;
        req.id = rootUser._id;
        next()

    } catch (e) {
        console.log(e);
        res.status(404).send({error: 'Authentication problem!!'})
    }
};

module.exports = checkAuthLogin;


