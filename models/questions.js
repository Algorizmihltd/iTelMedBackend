const mongoose = require("mongoose")
const Joi = require("joi")


const AnswerSchema = mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "Doctors",
        required: true,
        refPath: 'onModel',
        onModel: {
            type: String,
            required: true,
            enum: ['Doctors', 'Labs']
        }
    },
    date: { type: Date, default: Date.now() },
    answer: { type: String, required: true },
})

const Question = mongoose.model("Questions", new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    question: { type: String, required: true },
    date: { type: Date, default: Date.now() },
    answers: [AnswerSchema],
}))

const validateQuestion = question => {
    const Schema = Joi.object({
        user: Joi.string().required(),
        question: Joi.string().required(),
        answers: Joi.array()
    })

    return Schema.validate(question)
}

module.exports.Question = Question
module.exports.validateQuestion = validateQuestion