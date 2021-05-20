module.exports = io => {
    const router = require("express").Router()
    const { HealthFeed, validateHealthFeed } = require("../models/healthFeeds")

    router.get('/', async (req, res) => {
        const healthFeeds = await HealthFeed.find()
        res.status(200).send(healthFeeds)
    })

    router.put('/:id', async (req, res) => {
        const healthFeed = await HealthFeed.findByIdAndUpdate(req.params.id, {
            answer: req.body.answer
        })
        if (!healthFeed) return res.status(404).send("HealthFeed Not Found")
        io.emit("healthFeed-updated", { _id: req.params.id, answers: req.body.answers })
        res.send("Ok")
    })

    router.get('/me', async (req, res) => {
        const healthFeeds = await HealthFeed.find({ doctor: req.user._id })
        res.status(200).send(healthFeeds)
    })

    router.post('/', async (req, res) => {
        const { error } = validateHealthFeed({ ...req.body, doctor: req.user._id, })
        if (error) return res.status(400).send(error.details[0].message)
        const healthFeed = new HealthFeed({
            doctor: req.user._id,
            question: req.body.question,
            answer: req.body.answer
        })

        await healthFeed.save()
        io.emit("new-healthFeed", {...req.body, doctor: req.user._id, _id: healthFeed._id,})
        res.send("Ok")
    })

    router.delete('/:id', async (req, res) => {
        const healthFeed = HealthFeed.findByIdAndRemove(req.params.id)
        if (!healthFeed) return res.status(404).send("HealthFeed Not Found")
        io.emit("healthFeed-deleted", req.params.id)
        res.status(200).send("Ok")
    })

    return router
}