const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chanelModel = new Schema({
    username: String,
    password: String,
});

const ChanelModel = mongoose.model("ChanelModel", chanelModel);

module.exports = { ChanelModel, };