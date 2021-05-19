const mongoose = require("mongoose")
const Joi = require("joi")

const Document = mongoose.model("Documents", new mongoose.Schema({
    uploader: { type: String, required: true },
    date: { type: Date, default: Date.now() },
    title: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
}))

const validateDocument = document => {
    const Schema = Joi.object({
        uploader: Joi.string().required(),
        title: Joi.string().required(),
        name: Joi.string().required(),
        url: Joi.string().required(),
    })

    return Schema.validate(document)
}

module.exports.Document = Document
module.exports.validateDocument = validateDocument