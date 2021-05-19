const mongoose = require("mongoose")
const Joi = require("joi")

const LabTestResult = mongoose.model("LabTestResults", new mongoose.Schema({
    request: { type: mongoose.Schema.Types.ObjectId, ref: "LabTestRequests", required: true },
    date: { type: Date, default: Date.now() },
    name: { type: String, required: true },
    url: { type: String, required: true },
}))

const validateLabTestResult = labTestResult => {
    const Schema = Joi.object({
        url: Joi.string().required(),
        name: Joi.string().required(),
        request: Joi.string().required()
    })

    return Schema.validate(labTestResult)
}

module.exports.LabTestResult = LabTestResult
module.exports.validateLabTestResult = validateLabTestResult