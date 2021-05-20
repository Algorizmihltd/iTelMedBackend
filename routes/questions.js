module.exports = io => {
    const router = require("express").Router()
    const { Question, validateQuestion } = require("../models/questions")

    router.get('/', async (req, res) => {
        const questions = await Question.find().populate('user').sort({ date: -1 })
        const response = questions.map(q => ({
            question: q.question,
            answers: q.answers,
            date: q.date,
            _id: q._id,
            user: { _id: q.user._id, first_name: q.user.first_name, last_name: q.user.last_name, profile_image: q.user.profile_image, gender: q.user.gender }
        }))
        res.status(200).send(response)
    })

    router.put('/:id', async (req, res) => {
        const question = await Question.findByIdAndUpdate(req.params.id, {
            answers: req.body.answers
        })
        if (!question) return res.status(404).send("Question Not Found")
        io.emit("question-updated", { _id: req.params.id, answers: req.body.answers })
        res.send("Ok")
    })

    router.get('/me', async (req, res) => {
        const questions = await Question.find({ user: req.user._id })
        res.status(200).send(questions)
    })

    router.post('/', async (req, res) => {
        const { error } = validateQuestion({ ...req.body, user: req.user._id, })
        if(error) return res.status(400).send(error.details[0].message)
        const question = new Question({
            user: req.user._id,
            question: req.body.question,
            answers: []
        })

        await question.save()
        const q = await Question.findById(question._id).populate('user')
        io.emit("new-question", {...req.body, user: { _id: q.user._id, first_name: q.user.first_name, last_name: q.user.last_name, profile_image: q.user.profile_image, gender: q.user.gender }, _id: question._id, answers: []})
        res.send("Ok")
    })

    router.delete('/:id', async (req, res) => {
        const question = Question.findByIdAndRemove(req.params.id)
        if (!question) return res.status(404).send("Question Not Found")
        io.emit("question-deleted", req.params.id)
        res.status(200).send("Ok")
    })

    return router
}