const mongoose = require('mongoose')
const Joi = require('joi')

const Message = mongoose.model('Messages', new mongoose.Schema({
    content: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    file: {
        ftype: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    isSeen: {
        type: Boolean,
        default: false
    },
    senderType: {
        type: String,
        required: true
    }
}))

const validateMessage = message => {
    const Scheme = Joi.object({
        content: Joi.string(),
        user: Joi.string().required(),
        reciever: Joi.string().required(),
        file: Joi.object(),
        senderType: Joi.string().required()
    })

    return Scheme.validate(message)
}

module.exports.Message = Message
module.exports.validateMessage = validateMessage
