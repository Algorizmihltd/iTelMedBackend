const mongoose = require("mongoose")
const Joi = require("joi")

const Medication = mongoose.model("Medications", new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    refillTime: { type: [[Number]], required: true },
    completed: { type: Boolean, default: false },
    date: { type: Date, default: Date.now() },
    startDate: { type: Date, required: true },
    dosage: { type: Number, required: true },
    endDate: { type: Date, required: true },
    name: { type: String, required: true },
    time: { type: Date, required: true },
}))

const validateMedication = medication => {
    const Schema = Joi.object({
        user: Joi.string().required(),
        refillTime: Joi.array().required(),
        startDate: Joi.date().required(),
        dosage: Joi.number().required(),
        endDate: Joi.date().required(),
        name: Joi.string().required(),
        time: Joi.date().required(),
        completed: Joi.boolean()
    })

    return Schema.validate(medication)
}

module.exports.Medication = Medication
module.exports.validateMedication = validateMedication