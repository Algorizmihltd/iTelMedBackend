const locationSchema = require("./locationSchema")
const mongoose = require("mongoose")
const Joi = require("joi")

const User = mongoose.model("Users", new mongoose.Schema({
    emergency_contact: { type: String, required: true },
    profile_image: { type: String, required: true },
    phone_number: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address2: { type: String, required: true },
    address1: { type: String, required: true },
    password: { type: String, required: true },
    country: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    location: locationSchema,
}))

const validateUser = (user) => {
    const Schema = Joi.object({
        emergency_contact: Joi.string().required(),
        email: Joi.string().email().required(),
        profile_image: Joi.string().required(),
        phone_number: Joi.string().required(),
        first_name: Joi.string().required(),
        dateOfBirth: Joi.date().required(),
        last_name: Joi.string().required(),
        address1: Joi.string().required(),
        password: Joi.string().required(),
        address2: Joi.string().required(),
        country: Joi.string().required(),
        gender: Joi.string().required(),
        city: Joi.string().required(),
        location:{
            latitude: Joi.number().required(),
            longitude: Joi.number().required()
        }
    })

    return Schema.validate(user)
}

module.exports.User = User
module.exports.validateUser = validateUser