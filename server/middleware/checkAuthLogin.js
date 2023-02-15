const jwt = require('jsonwebtoken');
const {User} = require('../models/user');  

const checkAuthLogin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);

        const rootUser = await User.findOne({_id: decoded._id, 'tokens.token': token});

        if (!rootUser) {
            res.status(404).send({error: 'User not found'})
        }

        req.token = token;
        req.rootUser = rootUser;
        req.id = rootUser._id;
        next()

    } catch (e) {
        console.log(e);
        res.status(401).send({error: 'Authentication problem!!'})
    }
};

module.exports = checkAuthLogin;


