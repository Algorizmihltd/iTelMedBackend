const mongoose = require("mongoose")

const locationSchema = mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
})

module.exports = locationSchema