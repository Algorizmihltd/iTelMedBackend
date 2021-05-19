const locationSchema = require("./locationSchema")
const mongoose = require("mongoose")
const Joi = require("joi")

const Lab = mongoose.model("Labs", new mongoose.Schema({
    profile_image: { type: String, required: true },
    phone_number: { type: String, required: true },
    approved: { type: Boolean, default: false },
    password: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    location: locationSchema,
}))

const validateLab = lab => {
    const Schema = Joi.object({
        email: Joi.string().email().required(),
        profile_image: Joi.string().required(),
        phone_number: Joi.string().required(),
        password: Joi.string().required(),
        address: Joi.string().required(),
        location:{
            latitude: Joi.number().required(),
            longitude: Joi.number().required()
        },
        name: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        approved: Joi.boolean()
    })

    return Schema.validate(lab)
}

module.exports.Lab = Lab
module.exports.validateLab = validateLab