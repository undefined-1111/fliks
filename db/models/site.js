const mongoose = require("mongoose")
const schema = mongoose.Schema({
    _id: Number,
    date: Number,
    size: Number,
    URI: String,
});

module.exports = mongoose.model("config", schema)