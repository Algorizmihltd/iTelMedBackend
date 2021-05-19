const mongoose = require('mongoose')
const Joi = require('joi')


const Notification = mongoose.model('Notifications', new mongoose.Schema({
    isSeen: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    target: {
        name: {
            type: String,
            required: true
        },
        params: {
            type: Object
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
}))
module.exports.Notification = Notification
