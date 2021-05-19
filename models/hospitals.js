const mongoose = require('mongoose')
const Joi = require('joi')
const locationScheme = require('./locationSchema')

const Hospital = mongoose.model("Hospitals", new mongoose.Schema({
    profile_image: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    location: locationScheme,
}))

const validateHospital = hospital => {
    const Schema = Joi.object({
        email: Joi.string().email().required(),
        profile_image: Joi.string().required(),
        location:{
            latitude: Joi.number().required(),
            longitude: Joi.number().required()
        },
        password: Joi.string().required(),
        name: Joi.string().required(),
    })
    return Schema.validate(hospital)
}

module.exports.Hospital = Hospital
module.exports.validateHospital = validateHospital