module.exports = io => {
    const router = require("express").Router()
    const { LabTestRequest, validateLabTestRequest } = require("../models/labTestRequests")

    router.get('/', async (req, res) => {
        const labTestRequests = await LabTestRequest.find()
        res.status(200).send(labTestRequests)
    })

    router.get('/me', async (req, res) => {
        const labTestRequests = await LabTestRequest.find({ user: req.user._id })
        res.status(200).send(labTestRequests)
    })

    router.post('/', async (req, res) => {
        const { error } = validateLabTestRequest(req.body)
        if(error) return res.status(400).send(error.details[0].message)
        const labTestRequests = new LabTestRequest({
            timing: req.body.timing,
            status: req.body.status,
            user: req.body.user,
            name: req.body.name,
            lab: req.body.lab,
        })

        await labTestRequests.save()
        io.emit("new-labTestRequests", {...req.body, _id: labTestRequests._id, user: req.user._id})
        res.send("Ok")
    })

    router.delete('/:id', async (req, res) => {
        const labTestRequests = LabTestRequest.findByIdAndRemove(req.params.id)
        if (!labTestRequests) return res.status(404).send("Document Not Found")
        res.status(200).send("Ok")
    })

    return router
}