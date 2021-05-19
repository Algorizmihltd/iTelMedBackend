const mongoose = require("mongoose")
const Joi = require("joi")

const InsuranceInfo = mongoose.model("Insurance Info", new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref:  "Users", required: true },
    health_insurance_company: { type: String, required: true },
    health_insurance_id: { type: String, required: true },
    timing: { type: Date, required: true },
}))

const validateInsuranceInfo = (info) => {
    const Schema = Joi.object({
        health_insurance_company: Joi.string().required(),
        health_insurance_id: Joi.string().required(),
        user: Joi.string().required(),
        timing: Joi.date().required()
    })

    return Schema.validate(info)
}

module.exports.InsuranceInfo = InsuranceInfo
module.exports.validateInsuranceInfo = validateInsuranceInfo