const mongoose = require('mongoose')
const Joi = require('joi')

const PushToken = mongoose.model('PushTokens', new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    token: {
        type: String,
        require: true
    }
}))

const validatePushToken = token => {
    const Schema = Joi.object({
        user: Joi.string().required(),
        type: Joi.string().required(),
        token: Joi.string().required()
    })

    return Schema.validate(token)
}

module.exports.PushToken = PushToken
module.exports.validatePushToken = validatePushToken