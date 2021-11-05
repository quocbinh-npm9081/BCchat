const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/BCchat', {
            useNewUrlParser: true,
            //useCreateIndex: true,
            useUnifiedTopology: true,
            //  useFindAndModify: false

        });
        console.log('CONNECT SUCCESSFULY! ')
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connect };