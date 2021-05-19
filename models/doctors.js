const mongoose = require("mongoose")
const Joi = require("joi")
const locationSchema = require("./locationSchema")


const Doctor = mongoose.model("Doctors", new mongoose.Schema({
    first_name: { type: String, required: true },
    profile_image: { type: String, required: true },
    phone_number: { type: String, required: true },
    last_name: { type: String, required: true },
    approved: { type: Boolean, default: false },
    password: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true },
    state: { type: String, required: true },
    gender: { type: String, required: true },
    location: locationSchema,
    bio: { type: String, },
    services: [String],
}))

const validateDoctor = (doctor) => {
    const Schema = Joi.object({
        email: Joi.string().email().required(),
        profile_image: Joi.string().required(),
        phone_number: Joi.string().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        password: Joi.string().required(),
        address: Joi.string().required(),
        country: Joi.string().required(),
        gender: Joi.string().required(),
        state: Joi.string().required(),
        services: Joi.array(),
        bio: Joi.string(),
        location:{
            latitude: Joi.number().required(),
            longitude: Joi.number().required()
        },
        approved: Joi.boolean()
    })

    return Schema.validate(doctor)
}

module.exports.Doctor = Doctor
module.exports.validateDoctor = validateDoctor