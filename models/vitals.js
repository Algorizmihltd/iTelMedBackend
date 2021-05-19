const mongoose = require("mongoose")
const Joi = require("joi")

const Vitals = mongoose.model("Vitals", new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    blood_pressure_diastolic: { type: Number, required: true },
    blood_pressure_systolic: { type: Number, required: true },
    bio_blood_temprature: { type: Number, required: true },
    blood_glucose: { type: Number, required: true },
    heart_rate: { type: Number, required: true },
    date: { type: Date, default: Date.now() },
    height: { type: Number, required: true },
    mass: { type: Number, required: true },

}))


const validateVitals = (vitals) => {
    const Schema = Joi.object({
        blood_pressure_diastolic: Joi.number().required(),
        blood_pressure_systolic: Joi.number().required(),
        bio_blood_temprature: Joi.number().required(),
        body_mass_index: Joi.number().required(),
        blood_glucose: Joi.Number().required(),
        heart_rate: Joi.number().required(),
        height: Joi.number().required(),
        mass: Joi.number().required(),
        user: Joi.string().required(),
        
    })

    return Schema.validate(vitals)
}

module.exports.Vitals = Vitals
module.exports.validateVitals = validateVitals