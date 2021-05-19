const mongoose = require('mongoose')


const Issue = new mongoose.Schema({
    Accuracy: {
        type: Number,
        default: 0
    },
    ID: {
        type: Number,
        default: 0
    },
    Icd: {
        type: String,
        default: "Null"
    },
    IcdName: {
        type: String,
        default: "Null"
    },
    Name: {
        type: String,
        default: "Null"
    },
    ProfName: {
        type: String,
        default: "Null"
    },
    Ranking: {
        type: Number,
        default: 0
    },
})


const Report = mongoose.model("Reports",  new mongoose.Schema({
   time:{
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    issues: [Issue],
    selected: [String],
    mentioned: [String],
    specialisation: [String]
}))


module.exports.Report = Report
