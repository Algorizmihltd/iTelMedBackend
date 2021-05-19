const mongoose = require("mongoose")
const Joi = require("joi")

const Appointment = mongoose.model("Appointments", new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctors", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    date: { type: Date, default: Date.now() },
    time: { type: Date, required: true },
    accepted: { type: Boolean, default: false, required: true },
    slot: { type: String, required: true }
}))

const validateAppointment = appointment => {
    const Schema = Joi.object({
        doctor: Joi.string().required(),
        user: Joi.string().required(),
        time: Joi.date().required(),
        accepted: Joi.boolean().required(),
        slot: Joi.string().required()
    })

    return Schema.validate(appointment)
}

module.exports.Appointment = Appointment
module.exports.validateAppointment = validateAppointment