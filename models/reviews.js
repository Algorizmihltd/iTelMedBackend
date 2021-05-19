const mongoose = require("mongoose")
const Joi = require("joi")


const Review = mongoose.model("Reviews", new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctors" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    stars: { type: Number, require: true, default: 1 },
    date: { type: Date, default: Date.now() },
    text: { type: String, required: true },
}))


const validateReview = (review) => {
    const Schema = Joi.object({
        doctor: Joi.string().required(),
        user: Joi.string().required(),
        stars: Joi.number().required(),
        text: Joi.string().required()
    })
    
    return Schema.validate(review)
}

module.exports.Review = Review
module.exports.validateReview = validateReview