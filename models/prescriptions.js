const mongoose = require("mongoose")
const Joi = require("joi")

const Prescription = mongoose.model("Prescriptions", new mongoose.Schema({
    prescription_name: { type: String, required: true },
    timing: { type: Date, required: true },
    url: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctors", required: true },
    date: { type: Date, default: Date.now() }
}))

const validatePrescription = prescription => {
    const Schema = Joi.object({
        prescription_name: Joi.string().required(),
        timing: Joi.date().required(),
        url: Joi.string().required(),
        user: Joi.string().required(),
        doctor: Joi.string().required()
    })

    return Schema.validate(prescription)
}

module.exports.Prescription = Prescription
module.exports.validatePrescription = validatePrescription