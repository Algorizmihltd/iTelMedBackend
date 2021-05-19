const mongoose = require("mongoose")
const Joi = require("joi")

const HealthFeed = mongoose.model("HealthFeeds", new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctors", required: true },
    question: { type: String, required: true },
    date: { type: Date, default: Date.now() },
    answer: { type: String, required: true },
}))

const validateHealthFeed = healthFeed => {
    const Schema = Joi.object({
        question: Joi.string().required(),
        answer: Joi.string().required(),
        doctor: Joi.string().required()
    })

    return Schema.validate(healthFeed)
}

module.exports.HealthFeed = HealthFeed
module.exports.validateHealthFeed = validateHealthFeed