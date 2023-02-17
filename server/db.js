const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    try{
        mongoose.connect(process.env.DB, connectionParams);
        console.log('Connected to database SUCCESSFULLY');
    }catch(error){
        console.log(error);
        console.log('ERROR connecting to database');
    }
};





