const mongoose = require("mongoose")
const Joi = require("joi")

const LabTestRequest = mongoose.model("LabTestRequests", new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    lab: { type: mongoose.Schema.Types.ObjectId, ref: "Labs", required: true },
    date: { type: Date, default: Date.now() },
    status: { type: String, required: true },
    timing: { type: Date, required: true },
    name: { type: String, required: true },
}))

const validateLabTestRequest = labTestRequest => {
    const Schema = Joi.object({
        status: Joi.string().required(),
        user: Joi.string().required(),
        timing: Joi.date().required(),
        name: Joi.string().required(),
        lab: Joi.string().required(),
    })

    return Schema.validate(labTestRequest)
}

module.exports.LabTestRequest = LabTestRequest
module.exports.validateLabTestRequest = validateLabTestRequest